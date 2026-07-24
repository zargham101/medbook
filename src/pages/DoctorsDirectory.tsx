import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MapPin, Stethoscope, Filter, Loader2 } from 'lucide-react';
import { api, type DoctorProfile, type Profile } from '@/lib/api';
import { formatCurrency } from '@/lib/types';
import { Avatar } from '@/components/shared';
import { Card, Badge, EmptyState, Button } from '@/components/ui';

interface DoctorRow extends DoctorProfile {
  profiles?: Profile;
  avg_rating: number;
  review_count: number;
}

export function DoctorsDirectory() {
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.doctors.list();
        setDoctors(data as DoctorRow[]);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const specialties = useMemo(() => {
    const set = new Set(doctors.map((d) => d.specialty));
    return ['All', ...Array.from(set).sort()];
  }, [doctors]);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSpecialty = specialty === 'All' || d.specialty === specialty;
      const name = d.profiles?.full_name ?? '';
      const matchesQuery =
        !query ||
        name.toLowerCase().includes(query.toLowerCase()) ||
        d.specialty.toLowerCase().includes(query.toLowerCase()) ||
        d.clinic_address.toLowerCase().includes(query.toLowerCase());
      return matchesSpecialty && matchesQuery;
    });
  }, [doctors, query, specialty]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Find a doctor</h1>
          <p className="mt-2 text-slate-600">Browse our network of verified specialists and book your next appointment.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, specialty, or location..."
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="relative sm:w-56">
              <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Stethoscope className="h-6 w-6" />}
            title="No doctors found"
            description="Try adjusting your search or specialty filter to find available providers."
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-500">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} available</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doc) => (
                <Link key={doc.id} to={`/doctors/${doc.user_id}`} className="group">
                  <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-slate-200/60">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar name={doc.profiles?.full_name ?? 'Doctor'} size={56} />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-slate-900">{doc.profiles?.full_name}</h3>
                          <Badge variant="teal" className="mt-1">{doc.specialty}</Badge>
                        </div>
                      </div>
                      <p className="mt-4 line-clamp-2 text-sm text-slate-600">{doc.biography}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{doc.clinic_address}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-slate-900">
                            {doc.review_count > 0 ? doc.avg_rating.toFixed(1) : 'New'}
                          </span>
                          {doc.review_count > 0 && <span className="text-xs text-slate-500">({doc.review_count})</span>}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{formatCurrency(doc.consultation_fee)}</span>
                      </div>
                    </div>
                    <div className="rounded-b-2xl border-t border-slate-100 bg-slate-50/50 px-6 py-3">
                      <span className="text-sm font-medium text-teal-600 group-hover:text-teal-700">View profile & book →</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
