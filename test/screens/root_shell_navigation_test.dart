import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/screens/root_shell.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
  });

  testWidgets('tapping the Search nav tab switches the IndexedStack to index 1', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: RootShell()));
    await tester.pumpAndSettle();

    expect(tester.widget<IndexedStack>(find.byType(IndexedStack)).index, 0);

    await tester.tap(find.text('Search'));
    await tester.pumpAndSettle();

    expect(tester.widget<IndexedStack>(find.byType(IndexedStack)).index, 1);
  });

  testWidgets('tapping the Profile nav tab switches the IndexedStack to index 2', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: RootShell()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Profile'));
    await tester.pumpAndSettle();

    expect(tester.widget<IndexedStack>(find.byType(IndexedStack)).index, 2);
  });

  testWidgets('tapping the Home Map search pill switches to the Search tab', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: RootShell()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Cari ruang laktasi terdekat...'));
    await tester.pumpAndSettle();

    expect(tester.widget<IndexedStack>(find.byType(IndexedStack)).index, 1);
  });
}
