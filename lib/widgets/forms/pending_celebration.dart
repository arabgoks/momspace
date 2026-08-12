import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'dashed_border_box.dart';

/// Full-screen "pending verification" celebration: gradient circle with a
/// flipping hourglass, rotating dashed ring. Replaces the whole form body
/// after a location submission.
/// Source: design_handoff_momspace/README.md § 5 Tambah Lokasi Baru ›
/// Pending screen, § Interactions & Behavior › Animations.
class PendingCelebration extends StatefulWidget {
  const PendingCelebration({
    super.key,
    required this.title,
    required this.statusLabel,
    required this.subtitle,
    required this.primaryLabel,
    required this.onPrimary,
    required this.secondaryLabel,
    required this.onSecondary,
  });

  final String title;
  final String statusLabel;
  final String subtitle;
  final String primaryLabel;
  final VoidCallback onPrimary;
  final String secondaryLabel;
  final VoidCallback onSecondary;

  @override
  State<PendingCelebration> createState() => _PendingCelebrationState();
}

class _PendingCelebrationState extends State<PendingCelebration> with TickerProviderStateMixin {
  late final AnimationController _hourglassController;
  late final AnimationController _ringController;

  @override
  void initState() {
    super.initState();
    _hourglassController = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat();
    _ringController = AnimationController(vsync: this, duration: const Duration(seconds: 12))..repeat();
  }

  @override
  void dispose() {
    _hourglassController.dispose();
    _ringController.dispose();
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
                        child: const CustomPaint(size: Size(140, 140), painter: DashedRingPainter(color: AppColors.primary)),
                      ),
                    ),
                    Container(
                      width: 84,
                      height: 84,
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]),
                        shape: BoxShape.circle,
                      ),
                      child: AnimatedBuilder(
                        animation: _hourglassController,
                        builder: (context, child) {
                          final angle = _hourglassController.value < 0.5 ? 0.0 : math.pi;
                          return Transform.rotate(
                            angle: angle,
                            child: const Icon(Icons.hourglass_bottom_rounded, color: Colors.white, size: 36),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(widget.title, textAlign: TextAlign.center, style: AppTypography.nunito(fontSize: 22, fontWeight: FontWeight.w900)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.amberTint,
                  border: Border.all(color: AppColors.amberBorder),
                  borderRadius: BorderRadius.circular(AppRadius.pill),
                ),
                child: Text(widget.statusLabel, style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.amber)),
              ),
              const SizedBox(height: 12),
              Text(widget.subtitle, textAlign: TextAlign.center, style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
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
