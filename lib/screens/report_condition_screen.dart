import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../data/demo_rooms.dart';
import '../data/repository.dart';
import '../models/condition_report.dart';
import '../models/room.dart';
import '../theme/app_colors.dart';
import '../theme/app_shadows.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/forms/condition_chip.dart';
import '../widgets/forms/form_screen_header.dart';
import '../widgets/forms/notes_field.dart';
import '../widgets/forms/reward_banner.dart';
import '../widgets/forms/single_photo_upload_field.dart';
import '../widgets/forms/success_celebration.dart';

/// Submit a crowdsourced condition report for [room] (falls back to
/// [demoSelectedRoom] if none is given — same convention as
/// [RoomBottomSheet]). Earns +10 points; persisted via [RoomRepository].
/// Source: design_handoff_momspace/README.md § 4. Laporan Kondisi.
class ReportConditionScreen extends StatefulWidget {
  const ReportConditionScreen({super.key, this.room});

  final Room? room;

  @override
  State<ReportConditionScreen> createState() => _ReportConditionScreenState();
}

class _ReportConditionScreenState extends State<ReportConditionScreen> {
  static const _positiveConditions = ['Bersih', 'Kulkas menyala', 'Ruangan tersedia', 'Wastafel berfungsi'];
  static const _negativeConditions = ['Kotor', 'Kulkas mati', 'Ruangan terkunci', 'Fasilitas rusak'];

  final Set<String> _selectedConditions = {};
  final TextEditingController _notesController = TextEditingController();
  File? _photo;
  bool _submitted = false;

  Room get _room => widget.room ?? demoSelectedRoom;

  bool get _canSubmit => _selectedConditions.isNotEmpty;

  Future<void> _pickPhoto() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (picked != null) {
      setState(() => _photo = File(picked.path));
    }
  }

  void _toggleCondition(String label) {
    setState(() {
      if (!_selectedConditions.add(label)) _selectedConditions.remove(label);
    });
  }

  Future<void> _submit() async {
    if (!_canSubmit) return;
    await RoomRepository.instance.addReport(
      ConditionReport(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        roomId: _room.id,
        roomName: _room.name,
        conditions: _selectedConditions.toList(),
        photoPath: _photo?.path,
        notes: _notesController.text.trim(),
        timestamp: DateTime.now(),
      ),
    );
    if (!mounted) return;
    setState(() => _submitted = true);
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: _submitted ? null : FormScreenHeader(title: 'Laporan Kondisi', subtitle: _room.name),
      body: _submitted ? _buildSuccess(context) : _buildForm(context),
    );
  }

  Widget _buildSuccess(BuildContext context) {
    return SuccessCelebration(
      title: 'Terima kasih kontribusinya 🌸',
      subtitle: 'Laporanmu membantu ibu menyusui lain menemukan ruang yang tepat.',
      badgeText: '+10 poin ditambahkan!',
      primaryLabel: 'Kembali ke Peta',
      onPrimary: () => Navigator.of(context).popUntil((route) => route.isFirst),
      secondaryLabel: 'Lihat laporan saya',
      onSecondary: () => Navigator.of(context).popUntil((route) => route.isFirst),
    );
  }

  Widget _buildForm(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(AppSpacing.s18, AppSpacing.s18, AppSpacing.s18, AppSpacing.s24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Kondisi ruang saat ini', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  childAspectRatio: 2.8,
                  children: [
                    for (final label in _positiveConditions)
                      ConditionChip(
                        label: label,
                        isPositive: true,
                        selected: _selectedConditions.contains(label),
                        onTap: () => _toggleCondition(label),
                      ),
                    for (final label in _negativeConditions)
                      ConditionChip(
                        label: label,
                        isPositive: false,
                        selected: _selectedConditions.contains(label),
                        onTap: () => _toggleCondition(label),
                      ),
                  ],
                ),
                const SizedBox(height: 28),
                Text('Foto kondisi (opsional)', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                SinglePhotoUploadField(photo: _photo, onPick: _pickPhoto, onRemove: () => setState(() => _photo = null)),
                const SizedBox(height: 6),
                Text(
                  'Foto membantu pengguna lain menilai fasilitas',
                  style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
                const SizedBox(height: 28),
                Text('Catatan tambahan (opsional)', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                NotesField(controller: _notesController, hintText: 'Ceritakan kondisi ruangan secara singkat...'),
                const SizedBox(height: 20),
                const RewardBanner(points: 10),
              ],
            ),
          ),
        ),
        _buildSubmitBar(context),
      ],
    );
  }

  Widget _buildSubmitBar(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(14, 12, 14, MediaQuery.paddingOf(context).bottom + 12),
      decoration: const BoxDecoration(color: AppColors.surface, border: Border(top: BorderSide(color: AppColors.divider))),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(AppRadius.buttonLg),
                gradient: _canSubmit ? const LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]) : null,
                color: _canSubmit ? null : AppColors.disabledFill,
                boxShadow: _canSubmit ? AppShadows.roseCtaGlow : null,
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(AppRadius.buttonLg),
                  onTap: _canSubmit ? _submit : null,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.send_rounded, size: 18, color: _canSubmit ? Colors.white : AppColors.textFaint),
                        const SizedBox(width: 8),
                        Text(
                          'Kirim Laporan',
                          style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: _canSubmit ? Colors.white : AppColors.textFaint),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Laporan dikirim dengan timestamp otomatis',
            style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
          ),
        ],
      ),
    );
  }
}
