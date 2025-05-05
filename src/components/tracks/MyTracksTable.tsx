import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import * as React from "react";
import {FormSubmit, ListDetailTracks, ListDetailAlbums} from "@/types/types";
import Image from "next/image";
import {useState} from "react";
import { useRouter } from "next/navigation";
import {useDeleteMyTrackMutation} from "@/lib/features/tracks/trackApiSlice";
import {toast} from "react-toastify";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Hàm formatDate để định dạng ngày tháng
function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Kiểm tra xem date có hợp lệ không
  if (isNaN(date.getTime())) return '';
  
  // Định dạng: DD/MM/YYYY
  return `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')}/${
    date.getFullYear()}`;
}

interface Prop {
  tracks?: ListDetailTracks | undefined;
  albums?: ListDetailAlbums | undefined;
  page: number;
  setPage: any;
}



export default function MyTracksTable({tracks, albums, page, setPage}: Prop) {
  // Đơn giản hóa component, chỉ hiển thị danh sách tracks
  const pages = Math.floor((tracks?.count || 0) / 10);

  const [search, setSearch] = useState('')
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const router = useRouter()

  const [trackDelete, {isLoading}] = useDeleteMyTrackMutation();


  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    router.push(`?search=${search}`)
  }

  function handleFilterSubmit(e: React.MouseEvent<HTMLDivElement, MouseEvent>, filter: string) {
    e.preventDefault();
  }

  function handleDelete(slug: string) {
    alert('Are you sure you want to delete this track?');

    trackDelete({slug})
      .unwrap()
      .then(() => {
        toast.success('Deleted Track')
      })
      .catch(() => toast.error('Failed to delete Track'))
  }
  
  if (!tracks || !tracks.results) {
    return (
      <Card className="bg-black">
        <CardHeader>
          <CardTitle>Tracks</CardTitle>
          <CardDescription>No tracks available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-black">
      <CardHeader>
        <div>
          <CardTitle>Tracks</CardTitle>
          <CardDescription>
            Your tracks list.
          </CardDescription>
        </div>
        <Button size="sm" className="h-8 gap-1" onClick={() => router.push('tracks/create')}>
          <PlusCircle className="h-3.5 w-3.5"/>
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Track
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Album</TableHead>
              <TableHead className="hidden md:table-cell">Genre</TableHead>
              <TableHead className="hidden md:table-cell">Likes</TableHead>
              <TableHead className="hidden lg:table-cell">Is private</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.results.map((track) => (
              <TableRow key={track.id}>
                  <TableCell>
                  <Image
                    src={track.image || "/images/default-cover.png"}
                    alt={track.title}
                    width={40}
                    height={40}
                    className="aspect-square object-cover rounded-sm"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/tracks/${track.slug}`} className='hover:underline'>
                    {track.title}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  {formatDate(track.release_date)}
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/albums/${track?.album?.slug}`} className='hover:underline text-white/90'>
                    {track?.album.title}
                  </Link>
                </TableCell>
                <TableCell className="font-medium hidden md:table-cell">
                  {track?.genre && (
                    <Link href={`/genre/${track.genre.slug}`} className='hover:underline text-white/70'>
                      {track.genre.name}
                    </Link>
                  )}
                </TableCell>
                <TableCell className="font-medium hidden md:table-cell">
                  <span>
                    {track?.likes_count > 0 ? track.likes_count.toLocaleString() : "No likes"}
                  </span>
                </TableCell>
                <TableCell className="font-medium hidden lg:table-cell">
                  <span>{track?.is_private ? "Yes" : "No"}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}