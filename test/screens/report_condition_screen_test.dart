import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/screens/report_condition_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
  });

  testWidgets('Kirim Laporan is disabled until a condition chip is selected', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ReportConditionScreen()));
    await tester.pumpAndSettle();

    final submitFinder = find.widgetWithText(InkWell, 'Kirim Laporan');
    expect(tester.widget<InkWell>(submitFinder).onTap, isNull);

    await tester.tap(find.text('Bersih'));
    await tester.pump();

    expect(tester.widget<InkWell>(submitFinder).onTap, isNotNull);
  });

  testWidgets('submitting stores a report, awards points, and shows the success screen', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ReportConditionScreen()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Bersih'));
    await tester.pump();
    await tester.tap(find.text('Kirim Laporan'));
    // SuccessCelebration runs infinitely-repeating animations (dashed ring
    // spin, sparkle twinkle), so pumpAndSettle would never settle — pump a
    // bounded duration instead, enough for the async addReport + setState.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.textContaining('Terima kasih'), findsOneWidget);
    expect(RoomRepository.instance.rewardPoints, 10);
    expect(RoomRepository.instance.reports.single.conditions, contains('Bersih'));
  });

  testWidgets('tapping a chip twice deselects it', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ReportConditionScreen()));
    await tester.pumpAndSettle();

    final submitFinder = find.widgetWithText(InkWell, 'Kirim Laporan');

    await tester.tap(find.text('Bersih'));
    await tester.pump();
    expect(tester.widget<InkWell>(submitFinder).onTap, isNotNull);

    await tester.tap(find.text('Bersih'));
    await tester.pump();
    expect(tester.widget<InkWell>(submitFinder).onTap, isNull);
  });
}
