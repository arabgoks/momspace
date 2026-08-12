import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('checkIn marks a room checked in with ~30 minutes remaining', () async {
    await RoomRepository.instance.init();
    expect(RoomRepository.instance.isCheckedIn('room-1'), isFalse);

    RoomRepository.instance.checkIn('room-1');

    expect(RoomRepository.instance.isCheckedIn('room-1'), isTrue);
    final remaining = RoomRepository.instance.checkInRemaining('room-1');
    expect(remaining, isNotNull);
    expect(remaining!.inMinutes, inInclusiveRange(29, 30));
  });

  test('checkOut clears the checked-in state', () async {
    await RoomRepository.instance.init();
    RoomRepository.instance.checkIn('room-2');
    expect(RoomRepository.instance.isCheckedIn('room-2'), isTrue);

    RoomRepository.instance.checkOut('room-2');

    expect(RoomRepository.instance.isCheckedIn('room-2'), isFalse);
    expect(RoomRepository.instance.checkInRemaining('room-2'), isNull);
  });

  test('checking in one room does not affect another', () async {
    await RoomRepository.instance.init();
    RoomRepository.instance.checkIn('room-3');
    expect(RoomRepository.instance.isCheckedIn('room-4'), isFalse);
  });
}
