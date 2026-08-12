import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:momspace/data/app_session.dart';
import 'package:momspace/screens/login_screen.dart';

void main() {
  setUp(() {
    AppSession.instance.logOut();
  });

  testWidgets('submitting a valid email and password logs in and pops', (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: Builder(
        builder: (context) => Scaffold(
          body: Center(
            child: ElevatedButton(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen())),
              child: const Text('open'),
            ),
          ),
        ),
      ),
    ));
    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('loginEmailField')), 'ibu@momspace.id');
    await tester.enterText(find.byKey(const Key('loginPasswordField')), 'rahasia');
    await tester.tap(find.text('Masuk'));
    await tester.pumpAndSettle();

    expect(AppSession.instance.displayLabel, 'ibu@momspace.id');
    expect(find.byType(LoginScreen), findsNothing);
  });

  testWidgets('an invalid password shows a local validation error and does not log in', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('loginEmailField')), 'ibu@momspace.id');
    await tester.enterText(find.byKey(const Key('loginPasswordField')), 'abc');
    await tester.tap(find.text('Masuk'));
    await tester.pump();

    expect(AppSession.instance.displayLabel, isNull);
    expect(find.textContaining('Masukkan email valid'), findsOneWidget);
  });

  testWidgets('Lanjutkan sebagai Tamu pops without setting a session', (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: Builder(
        builder: (context) => Scaffold(
          body: Center(
            child: ElevatedButton(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen())),
              child: const Text('open'),
            ),
          ),
        ),
      ),
    ));
    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Lanjutkan sebagai Tamu'));
    await tester.pumpAndSettle();

    expect(AppSession.instance.displayLabel, isNull);
    expect(find.byType(LoginScreen), findsNothing);
  });
}
