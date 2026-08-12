import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';

/// Optional notes textarea with a live `n / maxLength` mono counter.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Notes,
/// § 5 Tambah Lokasi Baru › Informasi tambahan.
class NotesField extends StatefulWidget {
  const NotesField({
    super.key,
    required this.controller,
    required this.hintText,
    this.maxLength = 200,
  });

  final TextEditingController controller;
  final String hintText;
  final int maxLength;

  @override
  State<NotesField> createState() => _NotesFieldState();
}

class _NotesFieldState extends State<NotesField> {
  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onChanged);
    super.dispose();
  }

  void _onChanged() => setState(() {});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceSand,
        borderRadius: BorderRadius.circular(AppRadius.card),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          TextField(
            controller: widget.controller,
            maxLength: widget.maxLength,
            minLines: 2,
            maxLines: 4,
            buildCounter: (_, {required currentLength, required isFocused, maxLength}) => null,
            style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.ink),
            decoration: InputDecoration(
              hintText: widget.hintText,
              hintStyle: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.placeholder),
              border: InputBorder.none,
              isDense: true,
              contentPadding: EdgeInsets.zero,
            ),
          ),
          Text(
            '${widget.controller.text.length} / ${widget.maxLength}',
            style: AppTypography.mono(fontSize: 10.5, fontWeight: FontWeight.w600, color: AppColors.placeholder),
          ),
        ],
      ),
    );
  }
}
