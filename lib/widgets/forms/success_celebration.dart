import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'dashed_border_box.dart';

/// Full-screen success celebration: pop-in checkmark, rotating dashed ring,
/// staggered twinkling sparkles. Replaces the whole form body on submit.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Success
/// screen, § Interactions & Behavior › Animations.
class SuccessCelebration extends StatefulWidget {
  const SuccessCelebration({
    super.key,
    required this.title,
    required this.subtitle,
    required this.badgeText,
    required this.primaryLabel,
    required this.onPrimary,
    required this.secondaryLabel,
    required this.onSecondary,
  });

  final String title;
  final String subtitle;
  final String badgeText;
  final String primaryLabel;
  final VoidCallback onPrimary;
  final String secondaryLabel;
  final VoidCallback onSecondary;

  @override
  State<SuccessCelebration> createState() => _SuccessCelebrationState();
}

class _SuccessCelebrationState extends State<SuccessCelebration> with TickerProviderStateMixin {
  late final AnimationController _popController;
  late final AnimationController _ringController;
  late final AnimationController _sparkleController;

  @override
  void initState() {
    super.initState();
    _popController = AnimationController(vsync: this, duration: const Duration(milliseconds: 600))..forward();
    _ringController = AnimationController(vsync: this, duration: const Duration(seconds: 14))..repeat();
    _sparkleController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1600))..repeat();
  }

  @override
  void dispose() {
    _popController.dispose();
    _ringController.dispose();
    _sparkleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 140,
                height: 140,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    AnimatedBuilder(
                      animation: _ringController,
                      builder: (context, child) => Transform.rotate(
                        angle: _ringController.value * 2 * math.pi,
                        child: const CustomPaint(size: Size(140, 140), painter: DashedRingPainter()),
                      ),
                    ),
                    for (int i = 0; i < 3; i++)
                      AnimatedBuilder(
                        animation: _sparkleController,
                        builder: (context, child) {
                          final t = (_sparkleController.value + i / 3) % 1.0;
                          final opacity = (1 - (t - 0.5).abs() * 2).clamp(0.0, 1.0);
                          final angle = (i / 3) * 2 * math.pi;
                          return Positioned(
                            left: 70 + 55 * math.cos(angle) - 6,
                            top: 70 + 55 * math.sin(angle) - 6,
                            child: Opacity(
                              opacity: opacity,
                              child: const Icon(Icons.auto_awesome, size: 12, color: AppColors.primary),
                            ),
                          );
                        },
                      ),
                    ScaleTransition(
                      scale: CurvedAnimation(parent: _popController, curve: const Cubic(0.2, 1.4, 0.4, 1)),
                      child: Container(
                        width: 84,
                        height: 84,
                        decoration: const BoxDecoration(color: AppColors.secondary, shape: BoxShape.circle),
                        child: const Icon(Icons.check_rounded, color: Colors.white, size: 40),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(widget.title, textAlign: TextAlign.center, style: AppTypography.nunito(fontSize: 22, fontWeight: FontWeight.w900)),
              const SizedBox(height: 8),
              Text(widget.subtitle, textAlign: TextAlign.center, style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(color: AppColors.primaryTint, borderRadius: BorderRadius.circular(AppRadius.pill)),
                child: Text(widget.badgeText, style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w800, color: AppColors.primaryPressed)),
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: 220,
                child: ElevatedButton(
                  onPressed: widget.onPrimary,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.button)),
                    elevation: 0,
                  ),
                  child: Text(widget.primaryLabel, style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 12),
              GestureDetector(
                onTap: widget.onSecondary,
                child: Text(
                  widget.secondaryLabel,
                  style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textFaint)
                      .copyWith(decoration: TextDecoration.underline),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
