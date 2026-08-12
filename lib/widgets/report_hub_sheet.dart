import 'dart:ui';
import 'package:flutter/material.dart';

import '../models/room.dart';
import '../screens/report_condition_screen.dart';
import '../screens/submit_location_screen.dart';
import '../theme/app_colors.dart';
import '../theme/app_shadows.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';

void showReportHubSheet(BuildContext context, {Room? contextRoom}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    barrierColor: Colors.transparent,
    builder: (context) => _ReportHubSheet(contextRoom: contextRoom),
  );
}

class _ReportHubSheet extends StatelessWidget {
  const _ReportHubSheet({this.contextRoom});

  final Room? contextRoom;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 6, sigmaY: 6),
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Color(0x2E333727), // rgba(51,55,39,0.18)
                      Color(0x6B333727), // rgba(51,55,39,0.42)
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        Positioned(
          bottom: 84, // Above navbar
          left: 0,
          right: 0,
          child: Material(
            color: Colors.transparent,
            child: Container(
              decoration: const BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(28),
                  topRight: Radius.circular(28),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Color(0x383C281E), // rgba(60,40,30,0.22)
                    offset: Offset(0, -22),
                    blurRadius: 50,
                  )
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 14),
                  Container(
                    width: 44,
                    height: 5,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2D5C9),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text('Kontribusi Data', style: AppTypography.nunito(fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.3)),
                  const SizedBox(height: 4),
                  Text(
                    'Pilih jenis kontribusi yang ingin kamu berikan',
                    style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.muted),
                  ),
                  const SizedBox(height: 24),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: _OptionCard(
                      title: 'Laporkan Kondisi Ruang',
                      subtitle: 'Bagikan kondisi terkini ruang laktasi yang baru kamu kunjungi',
                      iconColor: AppColors.primaryPressed,
                      iconBgColor: AppColors.primaryTint,
                      iconData: Icons.fact_check_outlined,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => ReportConditionScreen(room: contextRoom)),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: _OptionCard(
                      title: 'Tambah Lokasi Baru',
                      subtitle: 'Usulkan ruang laktasi yang belum terdaftar di MomSpace',
                      iconColor: AppColors.sageDk,
                      iconBgColor: AppColors.sageTint,
                      iconData: Icons.add_location_alt_outlined,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const SubmitLocationScreen()));
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.star_rounded, color: AppColors.primary, size: 16),
                      const SizedBox(width: 6),
                      RichText(
                        text: TextSpan(
                          style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.ink),
                          children: const [
                            TextSpan(text: 'Setiap kontribusi memberi kamu '),
                            TextSpan(text: '+10 poin reward', style: TextStyle(fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Divider(color: AppColors.divider, height: 1, indent: 24, endIndent: 24),
                  InkWell(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 24),
                      alignment: Alignment.center,
                      child: Text('Batal', style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.textFaint)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _OptionCard extends StatefulWidget {
  const _OptionCard({
    required this.title,
    required this.subtitle,
    required this.iconColor,
    required this.iconBgColor,
    required this.iconData,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final Color iconColor;
  final Color iconBgColor;
  final IconData iconData;
  final VoidCallback onTap;

  @override
  State<_OptionCard> createState() => _OptionCardState();
}

class _OptionCardState extends State<_OptionCard> with SingleTickerProviderStateMixin {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) {
        setState(() => _isPressed = false);
        widget.onTap();
      },
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        curve: const Cubic(0.2, 0.8, 0.2, 1),
        transform: Matrix4.identity()..scale(_isPressed ? 0.985 : 1.0),
        transformAlignment: Alignment.center,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: _isPressed ? widget.iconColor.withValues(alpha: 0.1) : AppColors.surfaceSand,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: _isPressed ? widget.iconColor.withValues(alpha: 0.45) : const Color(0x0D3C281E),
            width: 1.5,
          ),
          boxShadow: _isPressed ? [
            BoxShadow(
              color: widget.iconColor.withValues(alpha: 0.22),
              offset: const Offset(0, 8),
              blurRadius: 20,
            )
          ] : [],
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: widget.iconBgColor,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(widget.iconData, color: widget.iconColor),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(widget.title, style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 4),
                  Text(widget.subtitle, style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                ],
              ),
            ),
            const SizedBox(width: 14),
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: _isPressed ? widget.iconColor : Colors.white,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.chevron_right_rounded,
                color: _isPressed ? Colors.white : AppColors.placeholder,
                size: 20,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
