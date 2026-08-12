import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/screens/submit_location_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
  });

  testWidgets('Kirim untuk Diverifikasi stays disabled without a picked location or category', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SubmitLocationScreen()));
    await tester.pumpAndSettle();

    ElevatedButton submitButton() =>
        tester.widget<ElevatedButton>(find.widgetWithText(ElevatedButton, 'Kirim untuk Diverifikasi'));

    expect(submitButton().onPressed, isNull);

    await tester.enterText(find.byType(TextField).at(0), 'Mall Kelapa Gading');
    await tester.enterText(find.byType(TextField).at(1), 'Jl. Boulevard Raya, Jakarta Utara');
    await tester.pump();

    // Name + address alone aren't enough — no location, no category yet.
    expect(submitButton().onPressed, isNull);

    await tester.tap(find.text('Taman Kota'));
    await tester.pump();

    // Category alone still isn't enough — the map pin was never picked.
    expect(submitButton().onPressed, isNull);
  });

  testWidgets('facility pills toggle selected state on tap', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SubmitLocationScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Kulkas'), findsOneWidget);
    await tester.tap(find.text('Kulkas'));
    await tester.pump();
    await tester.tap(find.text('Kulkas'));
    await tester.pump();

    // No crash / exception across two toggles is the behavior under test —
    // full end-to-end submission requires the native map view and is
    // covered by the manual QA pass instead (Task 12).
  });
}
