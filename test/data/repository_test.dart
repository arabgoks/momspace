import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/models/condition_report.dart';
import 'package:momspace/models/location_submission.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('addReport stores the report and awards 10 points', () async {
    await RoomRepository.instance.init();

    await RoomRepository.instance.addReport(
      ConditionReport(
        id: '1',
        roomId: 'room-1',
        roomName: 'Test Room',
        conditions: const ['Bersih'],
        timestamp: DateTime(2026, 1, 1),
      ),
    );

    expect(RoomRepository.instance.rewardPoints, 10);
    expect(RoomRepository.instance.reports, hasLength(1));
    expect(RoomRepository.instance.reports.first.roomName, 'Test Room');
  });

  test('addSubmission does not award points, and defaults to pending status',
      () async {
    await RoomRepository.instance.init();

    await RoomRepository.instance.addSubmission(
      LocationSubmission(
        id: 's1',
        name: 'New Location',
        address: 'Jl. Test',
        latitude: -6.2,
        longitude: 106.8,
        category: 'Taman Kota',
        timestamp: DateTime(2026, 1, 1),
      ),
    );

    expect(RoomRepository.instance.rewardPoints, 0);
    expect(RoomRepository.instance.submissions.single.status,
        SubmissionStatus.pending);
  });

  test('data survives re-initialization (simulated app restart)', () async {
    await RoomRepository.instance.init();
    await RoomRepository.instance.addSubmission(
      LocationSubmission(
        id: 's1',
        name: 'New Location',
        address: 'Jl. Test',
        latitude: -6.2,
        longitude: 106.8,
        category: 'Taman Kota',
        timestamp: DateTime(2026, 1, 1),
      ),
    );

    // Re-run init() against the same mocked SharedPreferences store.
    await RoomRepository.instance.init();

    expect(RoomRepository.instance.submissions, hasLength(1));
    expect(RoomRepository.instance.submissions.first.name, 'New Location');
  });
}
