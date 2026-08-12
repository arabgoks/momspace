import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:momspace/screens/search_screen.dart';

void main() {
  testWidgets('typing a query filters the results list', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SearchScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Grand Indonesia'), findsOneWidget);
    expect(find.text('Sarinah'), findsOneWidget);

    // A partial query (not the room's exact name) avoids the TextField's
    // own EditableText — which echoes the typed value — also matching
    // find.text() alongside the result card.
    await tester.enterText(find.byType(TextField), 'Sarina');
    await tester.pumpAndSettle();

    expect(find.text('Sarinah'), findsOneWidget);
    expect(find.text('Grand Indonesia'), findsNothing);
  });

  testWidgets('the "Buka sekarang" filter hides closed rooms', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SearchScreen()));
    await tester.pumpAndSettle();

    // Sarinah is closed in the demo dataset (lib/data/demo_rooms.dart).
    expect(find.text('Sarinah'), findsOneWidget);

    await tester.tap(find.text('Buka sekarang'));
    await tester.pumpAndSettle();

    expect(find.text('Sarinah'), findsNothing);
  });
}
