import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import '../ui/app_snackbar.dart';

class MockFilterSheet extends StatefulWidget {
  const MockFilterSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const MockFilterSheet(),
    );
  }

  @override
  State<MockFilterSheet> createState() => _MockFilterSheetState();
}

class _MockFilterSheetState extends State<MockFilterSheet> {
  final Map<String, bool> _filters = {
    'Bisa Pompa ASI': true,
    'Wastafel': false,
    'Sofa Nyaman': true,
    'Sterilizer': false,
    'Kulkas ASI': false,
  };

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(26),
          topRight: Radius.circular(26),
        ),
      ),
      padding: const EdgeInsets.only(top: AppSpacing.s12, bottom: AppSpacing.s24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: AppSpacing.s16),
              decoration: BoxDecoration(
                color: AppColors.disabledFill,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s20),
            child: Text(
              'Filter Fasilitas',
              style: AppTypography.sectionTitle(),
            ),
          ),
          const SizedBox(height: AppSpacing.s16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s20),
            child: Wrap(
              spacing: AppSpacing.s10,
              runSpacing: AppSpacing.s10,
              children: _filters.keys.map((key) {
                final isSelected = _filters[key]!;
                return FilterChip(
                  label: Text(
                    key,
                    style: AppTypography.quicksand(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: isSelected ? Colors.white : AppColors.body,
                    ),
                  ),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() {
                      _filters[key] = val;
                    });
                  },
                  backgroundColor: AppColors.surfaceSand,
                  selectedColor: AppColors.primary,
                  checkmarkColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                    side: BorderSide(
                      color: isSelected ? AppColors.primary : AppColors.disabledFill,
                    ),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s12, vertical: AppSpacing.s8),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: AppSpacing.s32),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s20),
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                AppSnackBar.show(context, 'Filter diterapkan (Mock)');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                elevation: 0,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
              ),
              child: Text(
                'Terapkan Filter',
                style: AppTypography.nunito(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          SizedBox(height: MediaQuery.paddingOf(context).bottom),
        ],
      ),
    );
  }
}
