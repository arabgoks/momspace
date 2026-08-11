import 'package:flutter_test/flutter_test.dart';

import 'package:momspace/main.dart';

void main() {
  testWidgets('MomSpace Home/Map screen renders the search pill and nav tabs',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MomSpaceApp());
    await tester.pump();

    expect(find.text('Cari ruang laktasi terdekat...'), findsOneWidget);
    expect(find.text('Map'), findsOneWidget);
    expect(find.text('Search'), findsOneWidget);
    expect(find.text('Report'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget);
  });
}
