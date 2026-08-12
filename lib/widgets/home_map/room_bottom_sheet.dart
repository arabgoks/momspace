import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../data/repository.dart';
import '../../models/room.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_shadows.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import '../../screens/detail_screen.dart';
import 'nearby_room_card.dart';
import 'rating_star.dart';
import 'skeleton_box.dart';

/// Which of the three Home/Map bottom-sheet states is showing.
/// Source: README.md § State Management › Home Map `sheetState`.
enum SheetVariant { defaultRoom, empty, loading }

const String _chevronGlyph = '''
<svg viewBox="0 0 24 24" fill="none">
  <path d="M9 6l6 6-6 6" stroke="#D88B7C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''';

/// Dispatches to the three Home/Map bottom-sheet states.
/// Source: home-map.jsx `SheetDefault` / `SheetEmpty` / `SheetLoading`.
class RoomBottomSheet extends StatelessWidget {
  const RoomBottomSheet({
    super.key,
    required this.variant,
    required this.selectedRoom,
    required this.nearbyRooms,
    this.onChevronTap,
    this.onSeeAllTap,
  });

  final SheetVariant variant;
  final Room selectedRoom;
  final List<Room> nearbyRooms;
  final VoidCallback? onChevronTap;
  final VoidCallback? onSeeAllTap;

  static double heightFor(SheetVariant v) =>
      v == SheetVariant.empty ? 210 : 188;

  @override
  Widget build(BuildContext context) {
    return switch (variant) {
      SheetVariant.empty =>
        SheetEmpty(rooms: nearbyRooms, onSeeAllTap: onSeeAllTap),
      SheetVariant.loading => const SheetLoading(),
      SheetVariant.defaultRoom =>
        SheetDefault(room: selectedRoom, onChevronTap: onChevronTap),
    };
  }
}

/// Shared chrome: white sheet, rounded top corners, centered drag handle.
class SheetShell extends StatelessWidget {
  const SheetShell({super.key, required this.height, required this.child});

  final double height;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(26),
          topRight: Radius.circular(26),
        ),
        boxShadow: AppShadows.bottomSheet,
      ),
      padding: const EdgeInsets.only(top: AppSpacing.s12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: AppSpacing.s12),
              decoration: BoxDecoration(
                color: AppColors.disabledFill,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Expanded(child: child),
        ],
      ),
    );
  }
}

class SheetFacilityTag extends StatelessWidget {
  const SheetFacilityTag(this.label, {super.key});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: AppColors.sageTint,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: AppTypography.quicksand(
          fontSize: 11.5,
          fontWeight: FontWeight.w700,
          color: AppColors.sageDk,
        ),
      ),
    );
  }
}

/// Default state — full detail card for the selected room.
class SheetDefault extends StatelessWidget {
  const SheetDefault({super.key, required this.room, this.onChevronTap});

  final Room room;
  final VoidCallback? onChevronTap;

  @override
  Widget build(BuildContext context) {
    return SheetShell(
      height: 188,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => DetailScreen(room: room)));
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(18),
                        gradient: const LinearGradient(
                          begin: Alignment(-0.7, -1),
                          end: Alignment(0.7, 1),
                          colors: [AppColors.primary, AppColors.rose03],
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x66E8A598), // rgba(232,165,152,0.4)
                            offset: Offset(0, 6),
                            blurRadius: 14,
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        room.avatarInitial,
                        style: AppTypography.nunito(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.s12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            room.name,
                            style: AppTypography.nunito(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              height: 1.25,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.s4),
                          Row(
                            children: [
                              Text(
                                room.distanceLabel,
                                style: AppTypography.quicksand(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.body,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.s8),
                              Opacity(
                                opacity: 0.4,
                                child: Text(
                                  '·',
                                  style: AppTypography.quicksand(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.body,
                                  ),
                                ),
                              ),
                              const SizedBox(width: AppSpacing.s8),
                              Container(
                                width: 7,
                                height: 7,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: !room.isOpen
                                      ? AppColors.textFaint
                                      : (RoomRepository.instance.isCheckedIn(room.id) ? AppColors.primaryPressed : AppColors.secondary),
                                  boxShadow: room.isOpen ? [
                                    BoxShadow(
                                      color: (RoomRepository.instance.isCheckedIn(room.id) ? AppColors.primaryPressed : AppColors.secondary).withValues(alpha: 0.2),
                                      spreadRadius: 3,
                                    ),
                                  ] : null,
                                ),
                              ),
                              const SizedBox(width: 5),
                              Text(
                                !room.isOpen
                                    ? 'Tutup'
                                    : (RoomRepository.instance.isCheckedIn(room.id) ? 'Sedang digunakan' : 'Buka sekarang'),
                                style: AppTypography.quicksand(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w700,
                                  color: !room.isOpen
                                      ? AppColors.body
                                      : (RoomRepository.instance.isCheckedIn(room.id) ? AppColors.primaryPressed : AppColors.secondary),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: AppSpacing.s4),
                          Row(
                            children: [
                              for (int i = 1; i <= 5; i++)
                                if (room.rating >= i)
                                  const RatingStar()
                                else if (room.rating >= i - 0.5)
                                  const RatingStar(half: true)
                                else
                                  const RatingStar(half: false, empty: true),
                              const SizedBox(width: AppSpacing.s4),
                              Text(
                                room.rating.toStringAsFixed(1),
                                style: AppTypography.nunito(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.ink,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.s4),
                              Text(
                                '(${room.reviewCount})',
                                style: AppTypography.quicksand(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textFaint,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: AppSpacing.s4),
                      child: Material(
                        color: AppColors.primaryTint,
                        shape: const CircleBorder(),
                        child: InkWell(
                          customBorder: const CircleBorder(),
                          onTap: onChevronTap,
                          child: SizedBox(
                            width: 36,
                            height: 36,
                            child: Center(
                              child: SvgPicture.string(_chevronGlyph, width: 14, height: 14),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(AppSpacing.s16, AppSpacing.s14, AppSpacing.s16, 0),
                child: Wrap(
                  spacing: AppSpacing.s6,
                  runSpacing: AppSpacing.s6,
                  children: [for (final f in room.facilities) SheetFacilityTag(f)],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Empty state — horizontal-scroll list of nearby rooms (no pin selected).
class SheetEmpty extends StatelessWidget {
  const SheetEmpty({super.key, required this.rooms, this.onSeeAllTap});

  final List<Room> rooms;
  final VoidCallback? onSeeAllTap;

  @override
  Widget build(BuildContext context) {
    return SheetShell(
      height: 210,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.s16, 0, AppSpacing.s16, AppSpacing.s10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Ruang laktasi terdekat', style: AppTypography.sectionTitle()),
                GestureDetector(
                  onTap: onSeeAllTap,
                  child: Text(
                    'Lihat semua',
                    style: AppTypography.quicksand(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryPressed,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.fromLTRB(AppSpacing.s16, 0, AppSpacing.s16, AppSpacing.s12),
              itemCount: rooms.length,
              separatorBuilder: (context, index) => const SizedBox(width: AppSpacing.s10),
              itemBuilder: (context, index) => SizedBox(
                width: 180,
                child: NearbyRoomCard(
                  room: rooms[index],
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => DetailScreen(room: rooms[index]))),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Loading state — skeleton shimmer while the selected room is fetched.
class SheetLoading extends StatelessWidget {
  const SheetLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return SheetShell(
      height: 188,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SkeletonBox(width: 64, height: 64, radius: 18),
                const SizedBox(width: AppSpacing.s12),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(top: AppSpacing.s4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _fractionalSkeleton(0.7, 14),
                        const SizedBox(height: AppSpacing.s8),
                        _fractionalSkeleton(0.5, 11),
                        const SizedBox(height: AppSpacing.s8),
                        _fractionalSkeleton(0.4, 11),
                      ],
                    ),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.only(top: AppSpacing.s4),
                  child: SkeletonBox(width: 36, height: 36, radius: 18),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.s16, AppSpacing.s16, AppSpacing.s16, 0),
            child: Row(
              children: const [
                SkeletonBox(width: 64, height: 22, radius: 11),
                SizedBox(width: AppSpacing.s6),
                SkeletonBox(width: 56, height: 22, radius: 11),
                SizedBox(width: AppSpacing.s6),
                SkeletonBox(width: 44, height: 22, radius: 11),
                SizedBox(width: AppSpacing.s6),
                SkeletonBox(width: 70, height: 22, radius: 11),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static Widget _fractionalSkeleton(double widthFactor, double height) {
    return FractionallySizedBox(
      widthFactor: widthFactor,
      alignment: Alignment.centerLeft,
      child: SkeletonBox(width: double.infinity, height: height, radius: 4),
    );
  }
}
