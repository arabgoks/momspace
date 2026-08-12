import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

const String _searchGlyph = '''
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="11" cy="11" r="7" stroke="#D88B7C" stroke-width="2.2"/>
  <path d="M20 20l-3.8-3.8" stroke="#D88B7C" stroke-width="2.4" stroke-linecap="round"/>
</svg>''';

const String _filterGlyph = '''
<svg viewBox="0 0 24 24" fill="none">
  <path d="M4 7h10M18 7h2M4 17h2M10 17h10M4 12h6M14 12h6"
    stroke="#D88B7C" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="16" cy="7" r="2.2" stroke="#D88B7C" stroke-width="2.2" fill="#fff"/>
  <circle cx="8" cy="17" r="2.2" stroke="#D88B7C" stroke-width="2.2" fill="#fff"/>
  <circle cx="12" cy="12" r="2.2" stroke="#D88B7C" stroke-width="2.2" fill="#fff"/>
</svg>''';

/// Floating search pill anchored near the top of the Home/Map screen.
/// Source: home-map.jsx `SearchBar`.
class SearchPill extends StatelessWidget {
  const SearchPill({super.key, this.onTap, this.onFilterTap});

  final VoidCallback? onTap;
  final VoidCallback? onFilterTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25),
        boxShadow: const [
          BoxShadow(
            color: Color(0x1A3C281E), // rgba(60,40,30,0.10)
            offset: Offset(0, 10),
            blurRadius: 24,
          ),
          BoxShadow(
            color: Color(0x0A3C281E), // rgba(60,40,30,0.04)
            offset: Offset(0, 1),
            blurRadius: 2,
          ),
        ],
      ),
      child: Material(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(25),
        child: InkWell(
          borderRadius: BorderRadius.circular(25),
          onTap: onTap,
          child: Container(
            height: 50,
            padding: const EdgeInsets.fromLTRB(18, 0, 8, 0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(25),
              border: Border.all(
                color: AppColors.primary.withValues(alpha: 0.25),
              ),
            ),
            child: Row(
              children: [
                SvgPicture.string(_searchGlyph, width: 18, height: 18),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Cari ruang laktasi terdekat...',
                    overflow: TextOverflow.ellipsis,
                    style: AppTypography.quicksand(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFFA68A82),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  width: 38,
                  height: 38,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Color(0x1A3C281E), // rgba(60,40,30,0.10)
                        offset: Offset(0, 2),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.white,
                    shape: const CircleBorder(),
                    child: InkWell(
                      customBorder: const CircleBorder(),
                      onTap: onFilterTap,
                      child: Center(
                        child: SvgPicture.string(_filterGlyph, width: 18, height: 18),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
