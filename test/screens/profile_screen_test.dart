import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/app_session.dart';
import 'package:momspace/data/repository.dart';
import 'package:momspace/models/condition_report.dart';
import 'package:momspace/screens/profile_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
    AppSession.instance.logOut();
  });

  testWidgets('shows the guest prompt and zero points with no contributions', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Kamu sedang menjelajah sebagai Tamu'), findsOneWidget);
    expect(find.text('0'), findsOneWidget);
    expect(find.text('Belum ada laporan kondisi yang kamu kirim.'), findsOneWidget);
  });

  testWidgets('reflects reward points and report history after a report is added', (tester) async {
    await RoomRepository.instance.addReport(
      ConditionReport(
        id: '1',
        roomId: 'room-1',
        roomName: 'Plaza Indonesia · Level 4',
        conditions: const ['Bersih'],
        timestamp: DateTime.now(),
      ),
    );

    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
    await tester.pumpAndSettle();

    expect(find.text('10'), findsOneWidget);
    expect(find.text('Plaza Indonesia · Level 4'), findsOneWidget);
  });

  testWidgets('hides the guest prompt once logged in', (tester) async {
    AppSession.instance.logIn('ibu@momspace.id');

    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Kamu sedang menjelajah sebagai Tamu'), findsNothing);
    expect(find.text('ibu@momspace.id'), findsOneWidget);
    expect(find.text('Keluar'), findsOneWidget);
  });
}
