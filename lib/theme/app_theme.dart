import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_typography.dart';

/// Root MaterialApp theme, built from MomSpace design tokens.
abstract final class AppTheme {
  static ThemeData get light {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: AppColors.surface,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: AppColors.mapLand,
      fontFamily: AppTypography.quicksandFamily,
    );

    return base.copyWith(
      textTheme: base.textTheme.apply(
        bodyColor: AppColors.body,
        displayColor: AppColors.ink,
      ),
      splashFactory: NoSplash.splashFactory,
      highlightColor: Colors.transparent,
    );
  }
}
