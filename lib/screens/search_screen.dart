import 'package:flutter/material.dart';

import '../data/demo_rooms.dart';
import '../models/room.dart';
import 'detail_screen.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/home_map/nearby_room_card.dart';

enum _SortBy { distance, rating }

/// Real search/filter over the demo room dataset. No pixel mockup exists
/// for a dedicated Search screen in design_handoff_momspace/ — styled from
/// the existing token system, reusing [NearbyRoomCard].
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  static const _facilityOptions = ['Bersih', 'Kulkas', 'AC', 'Stroller', 'Wastafel', 'Stopkontak', 'Privasi'];

  final _queryController = TextEditingController();
  final Set<String> _selectedFacilities = {};
  bool _openOnly = false;
  _SortBy _sortBy = _SortBy.distance;

  List<Room> get _allRooms => const [demoSelectedRoom, ...demoNearbyRooms];

  List<Room> get _results {
    final query = _queryController.text.trim().toLowerCase();
    final rooms = _allRooms.where((room) {
      final matchesQuery = query.isEmpty || room.name.toLowerCase().contains(query);
      final matchesFacilities = _selectedFacilities.every(room.facilities.contains);
      final matchesOpen = !_openOnly || room.isOpen;
      return matchesQuery && matchesFacilities && matchesOpen;
    }).toList();

    rooms.sort((a, b) => switch (_sortBy) {
          _SortBy.distance => a.distanceMeters.compareTo(b.distanceMeters),
          _SortBy.rating => b.rating.compareTo(a.rating),
        });
    return rooms;
  }

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final results = _results;
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.s18, AppSpacing.s18, AppSpacing.s18, AppSpacing.s12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Pencarian', style: AppTypography.screenTitle),
                  const SizedBox(height: 14),
                  _buildSearchField(),
                  const SizedBox(height: 12),
                  _buildFilterRow(),
                ],
              ),
            ),
            Expanded(
              child: results.isEmpty
                  ? _buildEmptyState()
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(AppSpacing.s18, 0, AppSpacing.s18, 88 + AppSpacing.s24),
                      itemCount: results.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final room = results[index];
                        return NearbyRoomCard(
                          room: room,
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => DetailScreen(room: room))),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchField() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(25),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          const Icon(Icons.search, color: AppColors.primaryPressed, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: TextField(
              controller: _queryController,
              onChanged: (_) => setState(() {}),
              style: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.ink),
              decoration: InputDecoration(
                hintText: 'Cari ruang laktasi terdekat...',
                hintStyle: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: const Color(0xFFA68A82)),
                border: InputBorder.none,
                isDense: true,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterRow() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          ChoiceChip(
            label: const Text('Buka sekarang'),
            selected: _openOnly,
            onSelected: (v) => setState(() => _openOnly = v),
            labelStyle: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: _openOnly ? Colors.white : AppColors.body),
            selectedColor: AppColors.secondary,
            backgroundColor: AppColors.surfaceSand,
            side: BorderSide.none,
          ),
          const SizedBox(width: 8),
          ChoiceChip(
            label: const Text('Terdekat'),
            selected: _sortBy == _SortBy.distance,
            onSelected: (_) => setState(() => _sortBy = _SortBy.distance),
            labelStyle: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: _sortBy == _SortBy.distance ? Colors.white : AppColors.body),
            selectedColor: AppColors.primary,
            backgroundColor: AppColors.surfaceSand,
            side: BorderSide.none,
          ),
          const SizedBox(width: 8),
          ChoiceChip(
            label: const Text('Rating tertinggi'),
            selected: _sortBy == _SortBy.rating,
            onSelected: (_) => setState(() => _sortBy = _SortBy.rating),
            labelStyle: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: _sortBy == _SortBy.rating ? Colors.white : AppColors.body),
            selectedColor: AppColors.primary,
            backgroundColor: AppColors.surfaceSand,
            side: BorderSide.none,
          ),
          const SizedBox(width: 8),
          for (final facility in _facilityOptions) ...[
            ChoiceChip(
              label: Text(facility),
              selected: _selectedFacilities.contains(facility),
              onSelected: (v) => setState(() {
                if (v) {
                  _selectedFacilities.add(facility);
                } else {
                  _selectedFacilities.remove(facility);
                }
              }),
              labelStyle: AppTypography.quicksand(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: _selectedFacilities.contains(facility) ? Colors.white : AppColors.body,
              ),
              selectedColor: AppColors.sageDk,
              backgroundColor: AppColors.surfaceSand,
              side: BorderSide.none,
            ),
            const SizedBox(width: 8),
          ],
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.s24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.search_off_rounded, size: 48, color: AppColors.disabledFill),
            const SizedBox(height: 12),
            Text(
              'Tidak ada ruang laktasi yang cocok dengan pencarianmu.',
              textAlign: TextAlign.center,
              style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textFaint),
            ),
          ],
        ),
      ),
    );
  }
}
