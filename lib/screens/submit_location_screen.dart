import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

import '../data/repository.dart';
import '../models/location_submission.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/forms/dashed_border_box.dart';
import '../widgets/forms/form_screen_header.dart';
import '../widgets/forms/notes_field.dart';
import '../widgets/forms/pending_celebration.dart';
import '../widgets/forms/photo_grid_upload_field.dart';
import 'location_picker_screen.dart';

/// Propose a new, unlisted lactation room. Enters a `pending` status until
/// verified (there is no admin reviewer in this app — status just stays
/// `pending`; verification UI is out of scope, see plan Global Constraints).
/// Source: design_handoff_momspace/README.md § 5. Tambah Lokasi Baru.
class SubmitLocationScreen extends StatefulWidget {
  const SubmitLocationScreen({super.key});

  @override
  State<SubmitLocationScreen> createState() => _SubmitLocationScreenState();
}

class _SubmitLocationScreenState extends State<SubmitLocationScreen> {
  static const _categories = [
    ('Pusat Perbelanjaan', Icons.shopping_bag_outlined),
    ('Stasiun / Terminal', Icons.train_outlined),
    ('Rumah Sakit / Klinik', Icons.local_hospital_outlined),
    ('Perkantoran', Icons.apartment_outlined),
    ('Taman Kota', Icons.park_outlined),
    ('Lainnya', Icons.more_horiz_outlined),
  ];

  static const _facilityOptions = [
    'Kulkas', 'Wastafel', 'Stopkontak', 'AC', 'Stroller friendly', 'Privasi', 'Kursi menyusui', 'Cermin',
  ];

  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _notesController = TextEditingController();

  LatLng? _pickedLocation;
  String? _category;
  final Set<String> _selectedFacilities = {};
  final List<File> _photos = [];
  TimeOfDay? _openTime;
  TimeOfDay? _closeTime;
  bool _submitted = false;

  bool get _canSubmit =>
      _nameController.text.trim().isNotEmpty &&
      _addressController.text.trim().isNotEmpty &&
      _pickedLocation != null &&
      _category != null;

  Future<void> _pickLocation() async {
    final result = await Navigator.push<LatLng>(
      context,
      MaterialPageRoute(builder: (_) => LocationPickerScreen(initialPosition: _pickedLocation)),
    );
    if (result != null) setState(() => _pickedLocation = result);
  }

  Future<void> _addPhoto() async {
    if (_photos.length >= 3) return;
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (picked != null) {
      setState(() => _photos.add(File(picked.path)));
    }
  }

  Future<void> _pickTime({required bool isOpenTime}) async {
    final result = await showTimePicker(context: context, initialTime: const TimeOfDay(hour: 8, minute: 0));
    if (result != null) {
      setState(() {
        if (isOpenTime) {
          _openTime = result;
        } else {
          _closeTime = result;
        }
      });
    }
  }

  String _formatTime(TimeOfDay? time) {
    if (time == null) return '--.--';
    return '${time.hour.toString().padLeft(2, '0')}.${time.minute.toString().padLeft(2, '0')}';
  }

  Future<void> _submit() async {
    if (!_canSubmit) return;
    await RoomRepository.instance.addSubmission(
      LocationSubmission(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: _nameController.text.trim(),
        address: _addressController.text.trim(),
        latitude: _pickedLocation!.latitude,
        longitude: _pickedLocation!.longitude,
        category: _category!,
        facilities: _selectedFacilities.toList(),
        photoPaths: _photos.map((f) => f.path).toList(),
        openTime: _openTime == null ? null : _formatTime(_openTime),
        closeTime: _closeTime == null ? null : _formatTime(_closeTime),
        notes: _notesController.text.trim(),
        timestamp: DateTime.now(),
      ),
    );
    if (!mounted) return;
    setState(() => _submitted = true);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: _submitted ? null : const FormScreenHeader(title: 'Tambah Lokasi Baru'),
      body: _submitted ? _buildPending(context) : _buildForm(context),
    );
  }

  Widget _buildPending(BuildContext context) {
    return PendingCelebration(
      title: 'Lokasi berhasil dikirim!',
      statusLabel: 'Menunggu verifikasi',
      subtitle: 'Tim MomSpace akan memverifikasi lokasi ini dalam waktu maksimal 2 × 24 jam.',
      primaryLabel: 'Kembali ke Peta',
      onPrimary: () => Navigator.of(context).popUntil((route) => route.isFirst),
      secondaryLabel: 'Lihat status pengajuan di Profil',
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
                _buildInfoBanner(),
                const SizedBox(height: 24),
                _sectionLabel('INFORMASI DASAR'),
                const SizedBox(height: 10),
                _fieldCard([
                  _labeledField(
                    label: 'Nama lokasi',
                    required: true,
                    child: _textField(_nameController, 'cth. Plaza Indonesia · Level 4'),
                  ),
                  _labeledField(
                    label: 'Alamat lengkap',
                    required: true,
                    child: _textField(_addressController, 'Jl. M.H. Thamrin No.28–30, Jakarta Pusat'),
                  ),
                  _labeledField(label: 'Titik di peta', required: true, child: _buildLocationField()),
                  _labeledField(label: 'Kategori lokasi', required: true, child: _buildCategoryGrid()),
                ]),
                const SizedBox(height: 24),
                _sectionLabel('FASILITAS YANG TERSEDIA'),
                const SizedBox(height: 10),
                _buildFacilityPills(),
                const SizedBox(height: 6),
                Text(
                  'Tim verifikasi akan memeriksa kembali di lapangan',
                  style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
                const SizedBox(height: 24),
                _sectionLabel('FOTO LOKASI'),
                const SizedBox(height: 10),
                PhotoGridUploadField(photos: _photos, maxPhotos: 3, onAdd: _addPhoto, onRemove: (i) => setState(() => _photos.removeAt(i))),
                const SizedBox(height: 6),
                Text(
                  'Foto membantu tim verifikasi memastikan keberadaan ruang laktasi',
                  style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
                const SizedBox(height: 24),
                _sectionLabel('INFORMASI TAMBAHAN'),
                const SizedBox(height: 10),
                _buildOperatingHours(),
                const SizedBox(height: 16),
                NotesField(controller: _notesController, hintText: 'Informasi lain yang perlu diketahui...'),
              ],
            ),
          ),
        ),
        _buildSubmitBar(context),
      ],
    );
  }

  Widget _buildInfoBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.32)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
            child: const Icon(Icons.info_outline, size: 18, color: AppColors.primaryPressed),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Lokasi yang kamu tambahkan akan diverifikasi oleh tim MomSpace sebelum ditampilkan kepada pengguna lain.',
                  style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.ink),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 13, color: AppColors.primaryPressed),
                    const SizedBox(width: 4),
                    Text(
                      'Proses verifikasi maksimal 2 × 24 jam',
                      style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primaryPressed),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionLabel(String text) => Text(text, style: AppTypography.monoLabel());

  Widget _fieldCard(List<Widget> fields) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceSand,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        children: [
          for (int i = 0; i < fields.length; i++)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: i == 0 ? null : const BoxDecoration(border: Border(top: BorderSide(color: AppColors.divider))),
              child: fields[i],
            ),
        ],
      ),
    );
  }

  Widget _labeledField({required String label, required bool required, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: TextSpan(
            style: AppTypography.monoLabel(color: AppColors.placeholder),
            children: [
              TextSpan(text: label.toUpperCase()),
              if (required) const TextSpan(text: ' *', style: TextStyle(color: AppColors.primary)),
            ],
          ),
        ),
        const SizedBox(height: 8),
        child,
      ],
    );
  }

  Widget _textField(TextEditingController controller, String hint) {
    return TextField(
      controller: controller,
      onChanged: (_) => setState(() {}),
      style: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.ink),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.placeholder),
        border: InputBorder.none,
        isDense: true,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }

  Widget _buildLocationField() {
    if (_pickedLocation == null) {
      return GestureDetector(
        onTap: _pickLocation,
        child: DashedBorderBox(
          color: AppColors.secondary,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14),
            alignment: Alignment.center,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.location_on_outlined, color: AppColors.sageDk, size: 18),
                const SizedBox(width: 8),
                Text('Pilih di peta', style: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w700, color: AppColors.sageDk)),
              ],
            ),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: SizedBox(
            height: 110,
            child: IgnorePointer(
              child: MapLibreMap(
                initialCameraPosition: CameraPosition(target: _pickedLocation!, zoom: 15),
                styleString: 'assets/map_style_momspace.json',
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: Text(
                '${_pickedLocation!.latitude.toStringAsFixed(4)}° LS, ${_pickedLocation!.longitude.toStringAsFixed(4)}° BT',
                style: AppTypography.mono(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.body),
              ),
            ),
            GestureDetector(
              onTap: _pickLocation,
              child: Text('Ubah', style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primaryPressed)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCategoryGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      childAspectRatio: 2.4,
      children: [
        for (final (label, icon) in _categories)
          GestureDetector(
            onTap: () => setState(() => _category = label),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              decoration: BoxDecoration(
                color: _category == label ? AppColors.primaryTint : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _category == label ? AppColors.primary : AppColors.dividerStrong,
                  width: _category == label ? 1.5 : 1,
                ),
              ),
              child: Row(
                children: [
                  Icon(icon, size: 16, color: _category == label ? AppColors.primaryPressed : AppColors.textMuted),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTypography.quicksand(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: _category == label ? AppColors.primaryPressed : AppColors.body,
                      ),
                    ),
                  ),
                  if (_category == label) const Icon(Icons.check_circle, size: 15, color: AppColors.primary),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildFacilityPills() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final facility in _facilityOptions)
          GestureDetector(
            onTap: () => setState(() {
              if (!_selectedFacilities.add(facility)) _selectedFacilities.remove(facility);
            }),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: _selectedFacilities.contains(facility) ? AppColors.sageTint : Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.pill),
                border: Border.all(
                  color: _selectedFacilities.contains(facility) ? AppColors.secondary.withValues(alpha: 0.4) : AppColors.dividerStrong,
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    _selectedFacilities.contains(facility) ? Icons.check : Icons.add,
                    size: 13,
                    color: _selectedFacilities.contains(facility) ? AppColors.sageDk : AppColors.placeholder,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    facility,
                    style: AppTypography.quicksand(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: _selectedFacilities.contains(facility) ? AppColors.sageDk : AppColors.body,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildOperatingHours() {
    return Row(
      children: [
        Expanded(child: _timeBox('BUKA', _openTime, () => _pickTime(isOpenTime: true))),
        const Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: Icon(Icons.arrow_forward, size: 16, color: AppColors.placeholder)),
        Expanded(child: _timeBox('TUTUP', _closeTime, () => _pickTime(isOpenTime: false))),
        const SizedBox(width: 8),
        Text('WIB', style: AppTypography.monoLabel()),
      ],
    );
  }

  Widget _timeBox(String label, TimeOfDay? time, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.divider)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: AppTypography.monoLabel(fontSize: 9.5)),
            const SizedBox(height: 2),
            Text(_formatTime(time), style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
          ],
        ),
      ),
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
            child: ElevatedButton(
              onPressed: _canSubmit ? _submit : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: _canSubmit ? AppColors.sageDk : AppColors.disabledFill,
                disabledBackgroundColor: AppColors.disabledFill,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.buttonLg)),
                elevation: 0,
              ),
              child: Text(
                'Kirim untuk Diverifikasi',
                style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: _canSubmit ? Colors.white : AppColors.textFaint),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text('* Wajib diisi', style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
        ],
      ),
    );
  }
}
