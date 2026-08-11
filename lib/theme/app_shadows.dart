import 'package:flutter/material.dart';

/// MomSpace design tokens — elevation / shadow recipes.
/// Source: README.md § Design Tokens › Spacing, radius, shadow.
abstract final class AppShadows {
  static const List<BoxShadow> cardRest = [
    BoxShadow(color: Color(0x0A3C281E), offset: Offset(0, 1), blurRadius: 2),
  ];

  static const List<BoxShadow> floatingButton = [
    BoxShadow(color: Color(0x2E3C281E), offset: Offset(0, 6), blurRadius: 16),
  ];

  static const List<BoxShadow> bottomSheet = [
    BoxShadow(color: Color(0x1F3C281E), offset: Offset(0, -16), blurRadius: 36),
  ];

  static const List<BoxShadow> reportHubSheet = [
    BoxShadow(color: Color(0x383C281E), offset: Offset(0, -22), blurRadius: 50),
  ];

  static const List<BoxShadow> roseCtaGlow = [
    BoxShadow(color: Color(0x6BD88B7C), offset: Offset(0, 10), blurRadius: 22),
  ];

  static const List<BoxShadow> sageCtaGlow = [
    BoxShadow(color: Color(0x668FAF8F), offset: Offset(0, 6), blurRadius: 14),
  ];

  static const List<BoxShadow> searchPill = [
    BoxShadow(color: Color(0x1A3C281E), offset: Offset(0, 10), blurRadius: 24),
    BoxShadow(color: Color(0x0A3C281E), offset: Offset(0, 1), blurRadius: 2),
  ];
}

/// Standard motion curves/durations used across MomSpace.
abstract final class AppMotion {
  static const Curve standard = Cubic(0.2, 0.8, 0.2, 1);
  static const Curve sheetEntry = Cubic(0.2, 0.9, 0.25, 1);
  static const Duration fast = Duration(milliseconds: 180);
  static const Duration standardDuration = Duration(milliseconds: 220);
  static const Duration sheetEntryDuration = Duration(milliseconds: 360);
}
