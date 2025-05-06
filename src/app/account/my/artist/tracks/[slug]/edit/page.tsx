"use client";
import {Separator} from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {useRouter} from "next/navigation";
import {useListMyAlbumQuery} from "@/lib/features/albums/albumApiSlice";
import FullScreenSpinner from "@/components/general/FullScreenSpinner";
import {TrackEditForm} from "@/components/forms/track-edit-form";
import {useListGenresQuery} from "@/lib/features/other/publicApiSlice";
import {useRetrieveMyTrackQuery} from "@/lib/features/tracks/trackApiSlice";

export default function Page({params}: { params: { slug: string } }) {
  const {
    data: track,
    isLoading: isLoadingT,
    isFetching: isFetchingT,
  } = useRetrieveMyTrackQuery({slug: params.slug})
  const {
    data: albums,
    isLoading: isLoadingA,
    isFetching: isFetchingA,
  } = useListMyAlbumQuery({})
  const {
    data: genres,
    isLoading: isLoadingG,
    isFetching: isFetchingG,
  } = useListGenresQuery({})

  const isLoading = (
    isLoadingT || isFetchingT || isLoadingA || isFetchingA ||
    isLoadingG || isFetchingG
  )

  const router = useRouter();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList className='text-l'>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <h1 onClick={() => router.back()}>Tracks</h1>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Track</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-6">
        <Separator className="mt-5 mb-3"/>
        <div>
          <h3 className="text-lg font-medium">Edit Track</h3>
        </div>
        <Separator/>
        {isLoading ? <FullScreenSpinner/> : (
          <TrackEditForm track={track} genres={genres} albums={albums}/>
        )}
      </div>
    </>
  )
}