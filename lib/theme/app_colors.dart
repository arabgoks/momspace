import 'package:flutter/material.dart';

/// MomSpace design tokens — colors.
/// Source of truth: design_handoff_momspace/README.md § Design Tokens › Colors.
abstract final class AppColors {
  // Rose (primary)
  static const Color primary = Color(0xFFE8A598);
  static const Color primaryPressed = Color(0xFFD88B7C);
  static const Color primaryDeep = Color(0xFFC97A6E);
  static const Color primaryTint = Color(0xFFFBEEEA);
  static const Color rose03 = Color(0xFFF2C6B8);
  static const Color rose05 = Color(0xFFF8DED4);

  // Sage (secondary)
  static const Color secondary = Color(0xFF8FAF8F);
  static const Color sageDk = Color(0xFF6B8A6B);
  static const Color sageTint = Color(0x2E8FAF8F); // rgba(143,175,143,0.18)

  // Status / accent
  static const Color muted = Color(0xFFAAB995);
  static const Color alert = Color(0xFFE8998A);
  static const Color amber = Color(0xFFD9982A);
  static const Color amberTint = Color(0x24D9982A); // rgba(217,152,42,0.14)
  static const Color amberBorder = Color(0x52D9982A); // rgba(217,152,42,0.32)

  // Surfaces
  static const Color surface = Color(0xFFFEFEFE);
  static const Color surfaceSand = Color(0xFFFBF6F1);
  static const Color surfaceSandAlt = Color(0xFFFBF4ED);

  // Text
  static const Color ink = Color(0xFF333727);
  static const Color body = Color(0xFF5C5347);
  static const Color textMuted = Color(0xFF7C7062);
  static const Color textFaint = Color(0xFF9E948A);
  static const Color placeholder = Color(0xFFA89991);

  // Disabled / dividers
  static const Color disabledFill = Color(0xFFE6DCD4);
  static const Color divider = Color(0x0F3C281E); // rgba(60,40,30,0.06)
  static const Color dividerStrong = Color(0x1F3C281E); // rgba(60,40,30,0.12)

  // Map
  static const Color userLocation = Color(0xFF5B8DEF);
  static const Color mapLand = Color(0xFFF4E8DA);
  static const Color mapBlockA = Color(0xFFF0E0CC);
  static const Color mapBlockB = Color(0xFFEFDBC4);
  static const Color mapPark = Color(0xFFC6D8C2);
  static const Color mapWater = Color(0xFFDCE7EB);
  static const Color mapRoad = Color(0xFFFFFFFF);
  static const Color pinClosed = Color(0xFFBFB6AE);

  // Gap Score ramp (dashboard) — kept for completeness of the token set.
  static const Color gapScore80 = Color(0xFFC97A6E);
  static const Color gapScore65 = Color(0xFFD88B7C);
  static const Color gapScore50 = Color(0xFFE8A598);
  static const Color gapScore35 = Color(0xFFF2C6B8);
  static const Color gapScore20 = Color(0xFFF8DED4);
  static const Color gapScoreLow = Color(0xFFFBEEEA);
}
