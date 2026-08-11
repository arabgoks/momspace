import 'dart:io';

Future<void> downloadFont(String family, String weight, String urlSuffix) async {
  final url = 'https://github.com/google/fonts/raw/main/ofl/$urlSuffix/static/$family-$weight.ttf';
  final file = File('assets/fonts/$family-$weight.ttf');
  print('Downloading $url');
  final request = await HttpClient().getUrl(Uri.parse(url));
  final response = await request.close();
  if (response.statusCode == 200) {
    await response.pipe(file.openWrite());
    print('Saved to \${file.path}');
  } else {
    print('Failed to download $url');
  }
}

void main() async {
  await Future.wait([
    downloadFont('Nunito', 'Medium', 'nunito'),
    downloadFont('Nunito', 'SemiBold', 'nunito'),
    downloadFont('Nunito', 'Bold', 'nunito'),
    downloadFont('Nunito', 'ExtraBold', 'nunito'),
    downloadFont('Nunito', 'Black', 'nunito'),
    
    downloadFont('Quicksand', 'Medium', 'quicksand'),
    downloadFont('Quicksand', 'SemiBold', 'quicksand'),
    downloadFont('Quicksand', 'Bold', 'quicksand'),
    
    downloadFont('JetBrainsMono', 'Medium', 'jetbrainsmono'),
    downloadFont('JetBrainsMono', 'SemiBold', 'jetbrainsmono'),
  ]);
  
  // Clean up variable fonts
  if (File('assets/fonts/Nunito-Variable.ttf').existsSync()) File('assets/fonts/Nunito-Variable.ttf').deleteSync();
  if (File('assets/fonts/Quicksand-Variable.ttf').existsSync()) File('assets/fonts/Quicksand-Variable.ttf').deleteSync();
  if (File('assets/fonts/JetBrainsMono-Variable.ttf').existsSync()) File('assets/fonts/JetBrainsMono-Variable.ttf').deleteSync();
}
