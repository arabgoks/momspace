import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';

/// Blue user-location marker with an infinite pulse ring.
/// Source: home-map.jsx `UserDot` / `@keyframes momPulse`
/// (2s ease-out infinite, scale 0.6 → 1.6, opacity 0.7 → 0).
class UserLocationDot extends StatefulWidget {
  const UserLocationDot({super.key});

  @override
  State<UserLocationDot> createState() => _UserLocationDotState();
}

class _UserLocationDotState extends State<UserLocationDot>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 48,
      height: 48,
      child: Stack(
        alignment: Alignment.center,
        children: [
          AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              final t = Curves.easeOut.transform(_controller.value);
              final scale = 0.6 + (1.6 - 0.6) * t;
              final opacity = 0.7 * (1 - t);
              return Opacity(
                opacity: opacity.clamp(0.0, 1.0),
                child: Transform.scale(
                  scale: scale,
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0x2E5B8DEF), // rgba(91,141,239,0.18)
                    ),
                  ),
                ),
              );
            },
          ),
          Container(
            width: 18,
            height: 18,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.userLocation,
              border: Border.all(color: Colors.white, width: 3),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x595B8DEF), // rgba(91,141,239,0.35)
                  offset: Offset(0, 2),
                  blurRadius: 8,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
