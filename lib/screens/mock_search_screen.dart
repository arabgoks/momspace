import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/ui/app_snackbar.dart';

const String _searchGlyph = '''
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="11" cy="11" r="7" stroke="#A89991" stroke-width="2.2"/>
  <path d="M20 20l-3.8-3.8" stroke="#A89991" stroke-width="2.4" stroke-linecap="round"/>
</svg>''';

const String _historyGlyph = '''
<svg viewBox="0 0 24 24" fill="none">
  <path d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#A89991" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''';

class MockSearchScreen extends StatefulWidget {
  const MockSearchScreen({super.key});

  @override
  State<MockSearchScreen> createState() => _MockSearchScreenState();
}

class _MockSearchScreenState extends State<MockSearchScreen> {
  final TextEditingController _controller = TextEditingController();

  final List<String> _recentSearches = [
    'Stasiun Sudirman',
    'Pondok Indah Mall 2',
    'Klinik Bunda',
    'Bandara Soekarno Hatta',
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onSearchSubmit(String query) {
    if (query.trim().isEmpty) return;
    FocusScope.of(context).unfocus();
    AppSnackBar.show(context, 'Mencari "$query"... (Mock)');
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) Navigator.pop(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.ink),
          onPressed: () => Navigator.pop(context),
        ),
        titleSpacing: 0,
        title: Padding(
          padding: const EdgeInsets.only(right: AppSpacing.s16),
          child: Hero(
            tag: 'search_bar_hero',
            child: Material(
              color: Colors.transparent,
              child: Container(
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.surfaceSand,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.divider),
                ),
                child: TextField(
                  controller: _controller,
                  autofocus: true,
                  textInputAction: TextInputAction.search,
                  onSubmitted: _onSearchSubmit,
                  style: AppTypography.quicksand(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.ink,
                  ),
                  decoration: InputDecoration(
                    hintText: 'Cari lokasi atau nama ruang...',
                    hintStyle: AppTypography.quicksand(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.placeholder,
                    ),
                    prefixIcon: Padding(
                      padding: const EdgeInsets.all(12),
                      child: SvgPicture.string(_searchGlyph),
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.s20, AppSpacing.s24, AppSpacing.s20, AppSpacing.s12),
            child: Text(
              'Pencarian Terakhir',
              style: AppTypography.sectionTitle(),
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _recentSearches.length,
              itemBuilder: (context, index) {
                final search = _recentSearches[index];
                return InkWell(
                  onTap: () {
                    _controller.text = search;
                    _onSearchSubmit(search);
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s20, vertical: AppSpacing.s14),
                    child: Row(
                      children: [
                        SvgPicture.string(_historyGlyph, width: 20, height: 20),
                        const SizedBox(width: AppSpacing.s16),
                        Expanded(
                          child: Text(
                            search,
                            style: AppTypography.quicksand(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: AppColors.body,
                            ),
                          ),
                        ),
                        const Icon(Icons.north_west, size: 16, color: AppColors.placeholder),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
