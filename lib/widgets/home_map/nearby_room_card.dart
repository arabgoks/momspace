import 'package:flutter/material.dart';

import '../../models/room.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'rating_star.dart';

/// A compact room summary card — avatar, name, distance/floor, rating,
/// open/closed badge. Used by the Home/Map empty-sheet horizontal list and
/// the Search screen's vertical results list.
/// Source: home-map.jsx `NearbyCard` (previously private `_NearbyRoomCard`
/// in room_bottom_sheet.dart).
class NearbyRoomCard extends StatelessWidget {
  const NearbyRoomCard({super.key, required this.room, this.onTap});

  final Room room;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.s12),
        decoration: BoxDecoration(
          color: AppColors.surfaceSand,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.divider),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 36,
              height: 36,
              margin: const EdgeInsets.only(bottom: AppSpacing.s8),
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.all(Radius.circular(10)),
                gradient: LinearGradient(
                  begin: Alignment(-0.7, -1),
                  end: Alignment(0.7, 1),
                  colors: [AppColors.primary, AppColors.rose03],
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                room.avatarInitial,
                style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white),
              ),
            ),
            Text(
              room.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800, height: 1.25),
            ),
            const SizedBox(height: 2),
            Text(
              '${room.distanceLabel} · ${room.floorLabel}',
              style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, height: 1.2, color: AppColors.body),
            ),
            const SizedBox(height: AppSpacing.s6),
            Row(
              children: [
                for (int i = 1; i <= 5; i++)
                  if (room.rating >= i)
                    const RatingStar(size: 10)
                  else if (room.rating >= i - 0.5)
                    const RatingStar(size: 10, half: true)
                  else
                    const RatingStar(size: 10, empty: true),
                const SizedBox(width: AppSpacing.s4),
                Text(
                  room.rating.toStringAsFixed(1),
                  style: AppTypography.nunito(fontSize: 11, fontWeight: FontWeight.w600, height: 1.2, color: AppColors.ink),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: room.isOpen ? AppColors.sageTint : AppColors.disabledFill,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    room.isOpen ? 'BUKA' : 'TUTUP',
                    style: AppTypography.quicksand(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w700,
                      height: 1.2,
                      color: room.isOpen ? AppColors.sageDk : AppColors.body,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
