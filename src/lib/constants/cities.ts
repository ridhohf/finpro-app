export interface City {
  name: string;
  province: string;
}

export const INDONESIAN_CITIES: City[] = [
  // DKI Jakarta
  { name: 'Jakarta Pusat', province: 'DKI Jakarta' },
  { name: 'Jakarta Utara', province: 'DKI Jakarta' },
  { name: 'Jakarta Barat', province: 'DKI Jakarta' },
  { name: 'Jakarta Selatan', province: 'DKI Jakarta' },
  { name: 'Jakarta Timur', province: 'DKI Jakarta' },

  // Jawa Barat
  { name: 'Bandung', province: 'Jawa Barat' },
  { name: 'Bogor', province: 'Jawa Barat' },
  { name: 'Bekasi', province: 'Jawa Barat' },
  { name: 'Depok', province: 'Jawa Barat' },
  { name: 'Cimahi', province: 'Jawa Barat' },
  { name: 'Tasikmalaya', province: 'Jawa Barat' },
  { name: 'Sukabumi', province: 'Jawa Barat' },
  { name: 'Cirebon', province: 'Jawa Barat' },
  { name: 'Karawang', province: 'Jawa Barat' },
  { name: 'Purwakarta', province: 'Jawa Barat' },

  // Jawa Tengah
  { name: 'Semarang', province: 'Jawa Tengah' },
  { name: 'Solo', province: 'Jawa Tengah' },
  { name: 'Magelang', province: 'Jawa Tengah' },
  { name: 'Salatiga', province: 'Jawa Tengah' },
  { name: 'Pekalongan', province: 'Jawa Tengah' },
  { name: 'Tegal', province: 'Jawa Tengah' },
  { name: 'Purwokerto', province: 'Jawa Tengah' },

  // DI Yogyakarta
  { name: 'Yogyakarta', province: 'DI Yogyakarta' },
  { name: 'Sleman', province: 'DI Yogyakarta' },
  { name: 'Bantul', province: 'DI Yogyakarta' },

  // Jawa Timur
  { name: 'Surabaya', province: 'Jawa Timur' },
  { name: 'Malang', province: 'Jawa Timur' },
  { name: 'Kediri', province: 'Jawa Timur' },
  { name: 'Madiun', province: 'Jawa Timur' },
  { name: 'Pasuruan', province: 'Jawa Timur' },
  { name: 'Probolinggo', province: 'Jawa Timur' },
  { name: 'Blitar', province: 'Jawa Timur' },
  { name: 'Mojokerto', province: 'Jawa Timur' },
  { name: 'Sidoarjo', province: 'Jawa Timur' },
  { name: 'Gresik', province: 'Jawa Timur' },
  { name: 'Banyuwangi', province: 'Jawa Timur' },

  // Banten
  { name: 'Tangerang', province: 'Banten' },
  { name: 'Tangerang Selatan', province: 'Banten' },
  { name: 'Serang', province: 'Banten' },
  { name: 'Cilegon', province: 'Banten' },

  // Bali
  { name: 'Denpasar', province: 'Bali' },
  { name: 'Badung', province: 'Bali' },
  { name: 'Gianyar', province: 'Bali' },
  { name: 'Tabanan', province: 'Bali' },
  { name: 'Ubud', province: 'Bali' },
  { name: 'Sanur', province: 'Bali' },
  { name: 'Nusa Dua', province: 'Bali' },
  { name: 'Seminyak', province: 'Bali' },
  { name: 'Kuta', province: 'Bali' },
  { name: 'Canggu', province: 'Bali' },
  { name: 'Jimbaran', province: 'Bali' },

  // Sumatera Utara
  { name: 'Medan', province: 'Sumatera Utara' },
  { name: 'Binjai', province: 'Sumatera Utara' },
  { name: 'Pematang Siantar', province: 'Sumatera Utara' },
  { name: 'Tebing Tinggi', province: 'Sumatera Utara' },

  // Sumatera Barat
  { name: 'Padang', province: 'Sumatera Barat' },
  { name: 'Bukittinggi', province: 'Sumatera Barat' },
  { name: 'Payakumbuh', province: 'Sumatera Barat' },

  // Riau
  { name: 'Pekanbaru', province: 'Riau' },
  { name: 'Dumai', province: 'Riau' },

  // Kepulauan Riau
  { name: 'Batam', province: 'Kepulauan Riau' },
  { name: 'Tanjung Pinang', province: 'Kepulauan Riau' },

  // Jambi
  { name: 'Jambi', province: 'Jambi' },

  // Sumatera Selatan
  { name: 'Palembang', province: 'Sumatera Selatan' },
  { name: 'Prabumulih', province: 'Sumatera Selatan' },

  // Bengkulu
  { name: 'Bengkulu', province: 'Bengkulu' },

  // Lampung
  { name: 'Bandar Lampung', province: 'Lampung' },
  { name: 'Metro', province: 'Lampung' },

  // Bangka Belitung
  { name: 'Pangkal Pinang', province: 'Bangka Belitung' },

  // Kalimantan Barat
  { name: 'Pontianak', province: 'Kalimantan Barat' },
  { name: 'Singkawang', province: 'Kalimantan Barat' },

  // Kalimantan Tengah
  { name: 'Palangkaraya', province: 'Kalimantan Tengah' },

  // Kalimantan Selatan
  { name: 'Banjarmasin', province: 'Kalimantan Selatan' },
  { name: 'Banjarbaru', province: 'Kalimantan Selatan' },

  // Kalimantan Timur
  { name: 'Balikpapan', province: 'Kalimantan Timur' },
  { name: 'Samarinda', province: 'Kalimantan Timur' },
  { name: 'Bontang', province: 'Kalimantan Timur' },

  // Kalimantan Utara
  { name: 'Tarakan', province: 'Kalimantan Utara' },

  // Sulawesi Utara
  { name: 'Manado', province: 'Sulawesi Utara' },
  { name: 'Bitung', province: 'Sulawesi Utara' },
  { name: 'Tomohon', province: 'Sulawesi Utara' },

  // Sulawesi Tengah
  { name: 'Palu', province: 'Sulawesi Tengah' },

  // Sulawesi Selatan
  { name: 'Makassar', province: 'Sulawesi Selatan' },
  { name: 'Parepare', province: 'Sulawesi Selatan' },
  { name: 'Palopo', province: 'Sulawesi Selatan' },

  // Sulawesi Tenggara
  { name: 'Kendari', province: 'Sulawesi Tenggara' },
  { name: 'Baubau', province: 'Sulawesi Tenggara' },

  // Gorontalo
  { name: 'Gorontalo', province: 'Gorontalo' },

  // Sulawesi Barat
  { name: 'Mamuju', province: 'Sulawesi Barat' },

  // Maluku
  { name: 'Ambon', province: 'Maluku' },
  { name: 'Tual', province: 'Maluku' },

  // Maluku Utara
  { name: 'Ternate', province: 'Maluku Utara' },
  { name: 'Tidore', province: 'Maluku Utara' },

  // Papua Barat
  { name: 'Manokwari', province: 'Papua Barat' },
  { name: 'Sorong', province: 'Papua Barat' },
  { name: 'Raja Ampat', province: 'Papua Barat' },

  // Papua
  { name: 'Jayapura', province: 'Papua' },

  // Nusa Tenggara Barat
  { name: 'Mataram', province: 'Nusa Tenggara Barat' },
  { name: 'Lombok', province: 'Nusa Tenggara Barat' },
  { name: 'Lombok Tengah', province: 'Nusa Tenggara Barat' },
  { name: 'Lombok Utara', province: 'Nusa Tenggara Barat' },
  { name: 'Lombok Timur', province: 'Nusa Tenggara Barat' },
  { name: 'Lombok Barat', province: 'Nusa Tenggara Barat' },
  { name: 'Sumbawa', province: 'Nusa Tenggara Barat' },

  // Nusa Tenggara Timur
  { name: 'Kupang', province: 'Nusa Tenggara Timur' },
  { name: 'Labuan Bajo', province: 'Nusa Tenggara Timur' },

  // Aceh
  { name: 'Banda Aceh', province: 'Aceh' },
  { name: 'Sabang', province: 'Aceh' },
  { name: 'Lhokseumawe', province: 'Aceh' },
];

// Helper function to group cities by province
export function groupCitiesByProvince() {
  return INDONESIAN_CITIES.reduce((acc, city) => {
    if (!acc[city.province]) {
      acc[city.province] = [];
    }
    acc[city.province].push(city);
    return acc;
  }, {} as Record<string, City[]>);
}

// Helper function to get all provinces
export function getAllProvinces(): string[] {
  return Array.from(new Set(INDONESIAN_CITIES.map((city) => city.province))).sort();
}

// Helper function to search cities
export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase();
  return INDONESIAN_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.province.toLowerCase().includes(lowerQuery)
  );
}