import 'package:flutter/foundation.dart';

/// Minimal, in-memory-only session concept — there is no backend auth in
/// this build, so nothing here is persisted; it resets every app run.
/// `displayLabel == null` means guest mode (the default).
class AppSession extends ChangeNotifier {
  static final AppSession instance = AppSession._internal();
  AppSession._internal();

  String? _displayLabel;
  String? get displayLabel => _displayLabel;

  void logIn(String label) {
    _displayLabel = label;
    notifyListeners();
  }

  void logOut() {
    _displayLabel = null;
    notifyListeners();
  }
}
