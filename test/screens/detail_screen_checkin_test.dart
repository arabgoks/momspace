import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/data/demo_rooms.dart';
import 'package:momspace/screens/detail_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
  });

  testWidgets('tapping Check-In switches the button to a Check-Out countdown', (tester) async {
    await tester.pumpWidget(MaterialApp(home: DetailScreen(room: demoSelectedRoom)));
    await tester.pumpAndSettle();

    expect(find.text('Check-In'), findsOneWidget);
    expect(RoomRepository.instance.isCheckedIn(demoSelectedRoom.id), isFalse);

    await tester.tap(find.text('Check-In'));
    await tester.pump();

    expect(RoomRepository.instance.isCheckedIn(demoSelectedRoom.id), isTrue);
    expect(find.textContaining('Check-Out'), findsOneWidget);

    await tester.tap(find.textContaining('Check-Out'));
    await tester.pump();

    expect(RoomRepository.instance.isCheckedIn(demoSelectedRoom.id), isFalse);
    expect(find.text('Check-In'), findsOneWidget);
  });
}
