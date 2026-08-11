import 'package:flutter/material.dart';

import 'app_colors.dart';

/// MomSpace design tokens — typography.
///
/// Fonts: Nunito (labels, headings, numerals) + Quicksand (body).
/// Monospace meta uses JetBrains Mono.
/// Source: README.md § Design Tokens › Typography.
abstract final class AppTypography {
  static const String nunitoFamily = 'Nunito';
  static const String quicksandFamily = 'Quicksand';
  static const String monoFamily = 'JetBrainsMono';

  static TextStyle nunito({
    required double fontSize,
    required FontWeight fontWeight,
    double? letterSpacing,
    double? height,
    Color color = AppColors.ink,
  }) {
    return TextStyle(
      fontFamily: nunitoFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      letterSpacing: letterSpacing,
      height: height,
      color: color,
    );
  }

  static TextStyle quicksand({
    required double fontSize,
    required FontWeight fontWeight,
    double? letterSpacing,
    double? height,
    Color color = AppColors.body,
  }) {
    return TextStyle(
      fontFamily: quicksandFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      letterSpacing: letterSpacing,
      height: height,
      color: color,
    );
  }

  static TextStyle mono({
    required double fontSize,
    required FontWeight fontWeight,
    double? letterSpacing,
    Color color = AppColors.placeholder,
  }) {
    return TextStyle(
      fontFamily: monoFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      letterSpacing: letterSpacing,
      color: color,
    );
  }

  // ─── Semantic presets ──────────────────────────────────────────────

  /// Screen title (mobile header center) — Nunito 800 / 16.
  static TextStyle get screenTitle =>
      nunito(fontSize: 16, fontWeight: FontWeight.w800);

  /// Large heading — Nunito 800–900 / 20–28, letter-spacing -0.3 to -0.6.
  static TextStyle headingLarge({
    double fontSize = 24,
    FontWeight fontWeight = FontWeight.w800,
    double letterSpacing = -0.4,
    Color color = AppColors.ink,
  }) =>
      nunito(
        fontSize: fontSize,
        fontWeight: fontWeight,
        letterSpacing: letterSpacing,
        color: color,
      );

  /// Section title — Nunito 800 / 14–15.
  static TextStyle sectionTitle({double fontSize = 15}) =>
      nunito(fontSize: fontSize, fontWeight: FontWeight.w800);

  /// Card title — Nunito 800 / 13–15, line-height 1.25.
  static TextStyle cardTitle({double fontSize = 15}) => nunito(
        fontSize: fontSize,
        fontWeight: FontWeight.w800,
        height: 1.25,
      );

  /// Nav label — Nunito 700 / 11, letter-spacing 0.1.
  static TextStyle navLabel({Color color = AppColors.placeholder}) => nunito(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.1,
        color: color,
      );

  /// Body — Quicksand 500–600 / 12.5–13.5, line-height 1.45–1.55.
  static TextStyle body({
    double fontSize = 13,
    FontWeight fontWeight = FontWeight.w600,
    Color color = AppColors.body,
  }) =>
      quicksand(
        fontSize: fontSize,
        fontWeight: fontWeight,
        height: 1.5,
        color: color,
      );

  /// Chip / tag — Quicksand 700 / 11–12.
  static TextStyle chip({double fontSize = 12, Color color = AppColors.sageDk}) =>
      quicksand(fontSize: fontSize, fontWeight: FontWeight.w700, color: color);

  /// Meta / caption — Quicksand 600 / 10.5–11.5.
  static TextStyle meta({double fontSize = 11.5, Color color = AppColors.textFaint}) =>
      quicksand(fontSize: fontSize, fontWeight: FontWeight.w600, color: color);

  /// Mono label — JetBrains Mono 500–600 / 9.5–11, uppercase, ls 1.2–1.4.
  /// Caller is responsible for upper-casing the text itself.
  static TextStyle monoLabel({
    double fontSize = 10.5,
    FontWeight fontWeight = FontWeight.w600,
    Color color = AppColors.placeholder,
  }) =>
      mono(
        fontSize: fontSize,
        fontWeight: fontWeight,
        letterSpacing: 1.3,
        color: color,
      );

  /// Dashboard stat — Nunito 900 / 28, letter-spacing -0.6.
  static TextStyle get dashboardStat => nunito(
        fontSize: 28,
        fontWeight: FontWeight.w900,
        letterSpacing: -0.6,
      );
}
