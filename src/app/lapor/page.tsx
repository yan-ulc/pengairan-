// app/lapor/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MapPicker from '@/components/MapPicker';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';

export default function LaporPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    nama: '',
    umur: '',
    alamat: '',
    email: '',
    nomor_telpon: '',
    jenis_kerusakan: '',
    foto: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const jenisKerusakanOptions = [
    'Kebocoran Pipa',
    'Saluran Tersumbat',
    'Kerusakan Pintu Air',
    'Erosi Tanggul',
    'Pompa Rusak',
    'Bendungan Bocor',
    'Lainnya',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, foto: 'Ukuran foto maksimal 5MB' }));
        return;
      }
      setFormData((prev) => ({ ...prev, foto: file }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, foto: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nama.trim()) newErrors.nama = 'Nama harus diisi';
    if (!formData.umur) newErrors.umur = 'Umur harus diisi';
    else if (parseInt(formData.umur) < 1 || parseInt(formData.umur) > 150)
      newErrors.umur = 'Umur tidak valid';
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat harus diisi';
    if (!formData.email.trim()) newErrors.email = 'Email harus diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Format email tidak valid';
    if (!formData.nomor_telpon.trim())
      newErrors.nomor_telpon = 'Nomor telepon harus diisi';
    if (!formData.jenis_kerusakan)
      newErrors.jenis_kerusakan = 'Jenis kerusakan harus dipilih';
    if (!selectedLocation)
      newErrors.lokasi = 'Lokasi kerusakan harus ditandai di peta';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload foto terlebih dahulu jika ada
      let fotoUrl = '';
      if (formData.foto) {
        // Simulasi upload - ganti dengan upload service Anda (misal: uploadthing, cloudinary, dll)
        const fotoFormData = new FormData();
        fotoFormData.append('file', formData.foto);
        
        // Untuk development, kita convert ke base64
        // Di production, gunakan service upload seperti uploadthing atau cloudinary
        const reader = new FileReader();
        fotoUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.foto!);
        });
      }

      // Submit data
      const response = await fetch('/api/laporan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: formData.nama,
          umur: parseInt(formData.umur),
          alamat: formData.alamat,
          email: formData.email,
          nomor_telpon: formData.nomor_telpon,
          jenis_kerusakan: formData.jenis_kerusakan,
          foto_url: fotoUrl,
          latitude: selectedLocation!.lat,
          longitude: selectedLocation!.lng,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengirim laporan');
      }

      setIsSuccess(true);

      // Reset form setelah 2 detik
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Laporan Berhasil Dikirim!
          </h2>
          <p className="text-gray-600">
            Terima kasih atas laporan Anda. Tim kami akan segera menindaklanjuti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Lapor Kerusakan Fasilitas
            </h1>
            <p className="text-gray-600">
              Laporkan kerusakan infrastruktur pengairan untuk ditindaklanjuti
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Pelapor */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Data Pelapor
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nama">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    className={errors.nama ? 'border-red-500' : ''}
                  />
                  {errors.nama && (
                    <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="umur">
                    Umur <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="umur"
                    name="umur"
                    type="number"
                    value={formData.umur}
                    onChange={handleInputChange}
                    placeholder="Masukkan umur"
                    className={errors.umur ? 'border-red-500' : ''}
                  />
                  {errors.umur && (
                    <p className="text-red-500 text-sm mt-1">{errors.umur}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="alamat">
                  Alamat <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  className={errors.alamat ? 'border-red-500' : ''}
                />
                {errors.alamat && (
                  <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contoh@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nomor_telpon">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nomor_telpon"
                    name="nomor_telpon"
                    type="tel"
                    value={formData.nomor_telpon}
                    onChange={handleInputChange}
                    placeholder="08xxxxxxxxxx"
                    className={errors.nomor_telpon ? 'border-red-500' : ''}
                  />
                  {errors.nomor_telpon && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nomor_telpon}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Kerusakan */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Detail Kerusakan
              </h2>

              <div>
                <Label htmlFor="jenis_kerusakan">
                  Jenis Kerusakan <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.jenis_kerusakan}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, jenis_kerusakan: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.jenis_kerusakan ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Pilih jenis kerusakan" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisKerusakanOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jenis_kerusakan && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jenis_kerusakan}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="foto">Foto Kerusakan</Label>
                <div className="mt-2">
                  <label
                    htmlFor="foto"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {fotoPreview ? (
                      <img
                        src={fotoPreview}
                        alt="Preview"
                        className="h-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Klik untuk upload foto
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG maksimal 5MB
                        </p>
                      </div>
                    )}
                    <input
                      id="foto"
                      name="foto"
                      type="file"
                      accept="image/*"
                      onChange={handleFotoChange}
                      className="hidden"
                    />
                  </label>
                  {errors.foto && (
                    <p className="text-red-500 text-sm mt-1">{errors.foto}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>
                  Lokasi Kerusakan <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  Klik pada peta untuk menandai lokasi kerusakan
                </p>
                <MapPicker
                  onLocationSelect={(lat, lng) => {
                    setSelectedLocation({ lat, lng });
                    setErrors((prev) => ({ ...prev, lokasi: '' }));
                  }}
                  selectedLocation={selectedLocation}
                />
                {errors.lokasi && (
                  <p className="text-red-500 text-sm mt-1">{errors.lokasi}</p>
                )}
                {selectedLocation && (
                  <p className="text-sm text-gray-600 mt-2">
                    Koordinat: {selectedLocation.lat.toFixed(6)},{' '}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim Laporan...
                </>
              ) : (
                'Kirim Laporan'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}