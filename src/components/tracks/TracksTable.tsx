"use client";

import {Track} from "@/types/types";
import {Check, CircleCheck, CirclePlus, Clock3, Music} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState, useEffect} from "react";
import PlayTrackButton from "./PlayTrackButton";
import {useAppSelector} from "@/lib/hooks";
import {formatTime} from "@/utils/clientUtils";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Loader from "@/components/general/Loader";
import {
  useListUserTracksLikedQuery,
} from "@/lib/features/tracks/trackApiSlice";
import FullScreenSpinner from "@/components/general/FullScreenSpinner";
import useFavoriteFollow from "@/hooks/use-favorite-follow";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {toast} from "react-toastify";
import {usePlaylistAddTrackMutation, usePlaylistRemoveTrackMutation, useListMyPlaylistQuery} from "@/lib/features/playlists/playlistApiSlice";
import TrackDialogDropdown from "@/components/tracks/TrackDialogDropdown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {CaretSortIcon} from "@radix-ui/react-icons";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface Props {
  tracks: Track[] | undefined;
  tracksPlaylist?: Track[] | undefined;
  playlistSlug?: string | undefined;
  showHeader?: boolean;
  showCardHeader?: boolean;
  showArtistCardHeader?: boolean;
  showCover?: boolean;
  showAlbum?: boolean;
  showPlaysCount?: boolean;
  showSubtitle?: boolean;
  showIndex?: boolean;
  showAddToPlaylist?: boolean;
  showRemoveTrack?: boolean;
}

export default function TracksTable({
                                      tracks,
                                      tracksPlaylist,
                                      showSubtitle = false,
                                      showCover = false,
                                      showHeader = false,
                                      showCardHeader = false,
                                      showArtistCardHeader = false,
                                      showAlbum = false,
                                      showPlaysCount = false,
                                      showIndex = true,
                                      showAddToPlaylist = true,
                                      playlistSlug,
                                      showRemoveTrack = false,
                                    }: Props) {
  const {isAuthenticated} = useAppSelector(state => state.auth)
  const {activeTrack} = useAppSelector(state => state.track)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredTrackSlug, setHoveredTrackSlug] = useState<string | null>(null);
  const [selectedPlaylistSlug, setSelectedPlaylistSlug] = useState<string | null>(playlistSlug || null);
  const [openPlaylistDropdown, setOpenPlaylistDropdown] = useState<number | null>(null);
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  const [addTrackToPlaylist, {isLoading: isLoadingAddTP}] = usePlaylistAddTrackMutation()
  const [removeTrackFromPlaylist, {isLoading: isLoadingRemoveTP}] = usePlaylistRemoveTrackMutation()
  const {data: myPlaylists, isLoading: isLoadingPlaylists, error: playlistsError} = useListMyPlaylistQuery({});

  // Log detailed information about playlists
  useEffect(() => {
    console.log("TracksTable - MyPlaylists Data:", myPlaylists);
    
    if (playlistsError) {
      console.error("TracksTable - Error loading playlists:", playlistsError);
    }
    
    if (myPlaylists) {
      console.log("TracksTable - Playlists count:", myPlaylists.count);
      console.log("TracksTable - Playlists next page:", myPlaylists.next);
      console.log("TracksTable - Playlists previous page:", myPlaylists.previous);
      
      if (myPlaylists.results && myPlaylists.results.length > 0) {
        console.log("TracksTable - First 3 playlists:", myPlaylists.results.slice(0, 3).map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          image: p.image,
          tracks: p.tracks?.length || 'N/A'
        })));
        
        // Log full structure of first playlist for debugging
        console.log("TracksTable - First playlist full structure:", myPlaylists.results[0]);
      } else {
        console.log("TracksTable - No playlists found or empty results array");
      }
    } else {
      console.log("TracksTable - Playlists data is undefined");
    }
  }, [myPlaylists, playlistsError]);

  useEffect(() => {
    console.log("TracksTable props:", {
      tracksLength: tracks?.length,
      tracksPlaylistLength: tracksPlaylist?.length,
      playlistSlug,
      showAddToPlaylist,
      showRemoveTrack
    });
  }, [tracks, tracksPlaylist, playlistSlug, showAddToPlaylist, showRemoveTrack]);
                                    
  const {
    data: tracksFav,
    isLoading: isLoadingTrFav,
    isFetching: isFetchingTrFav,
  } = useListUserTracksLikedQuery({}, {skip: !isAuthenticated || !tracks});

  const {
    handleAddFav,
    handleRemoveFav,
    isLoadingAddFav,
    isLoadingRemoveFav,
  } = useFavoriteFollow({favoriteType: "track", trackSlug: hoveredTrackSlug})


  const load = isLoadingTrFav || isFetchingTrFav

  function handleAddToPlaylist(e: React.MouseEvent<HTMLButtonElement>, trackSlug: string, playlistSlug: string) {
    e.preventDefault();

    addTrackToPlaylist({playlistSlug: playlistSlug, trackSlug: trackSlug})
      .unwrap()
      .then((data) => {
        toast.success(data?.msg || "Track add to playlist successfully")
      })
      .catch((error) => {
        toast.error(error?.data?.msg || "Failed to added track to playlist.")
      })
  }

  function handleRemoveFromPlaylist(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    removeTrackFromPlaylist({playlistSlug: playlistSlug, trackSlug: hoveredTrackSlug})
      .unwrap()
      .then((data) => {
        toast.success(data?.msg || "Track remove from playlist successfully")
      })
      .catch((error) => {
        toast.error(error?.data?.msg || "Failed to removed track from playlist.")
      })
  }


  if (load) return <FullScreenSpinner/>


  return (
    <div className="mt-4">
      {/* Table Header */}

      {showCardHeader && (
        <header className="bg-white/10 hover:bg-white/20 w-full h-20 mb-0.5 shadow-lg rounded-t-lg overflow-hidden">
          <Link href={`/albums/${tracks?.[0]?.album?.slug}`} className="">
            <div className="flex justify-start items-center space-x-4">
              {tracks?.[0]?.album ? (
                <Image
                  src={tracks[0].album?.image}
                  alt={tracks[0].album?.title}
                  height={80}
                  width={80}
                  className="aspect-square object-cover h-20 w-20"
                  priority
                />
              ) : (
                <div>
                  <Music size={80}/>
                </div>
              )}
              <div>
                <h5 className="text-xs font-normal text-white">From the album</h5>
                <h2 className="text-white text-lg font-semibold hover:underline">
                  {tracks?.[0]?.album?.title}
                </h2>
              </div>
            </div>
          </Link>
        </header>
      )}

      {showArtistCardHeader && (
        <header className="bg-white/10 hover:bg-white/20 w-full h-20 mb-0.5 shadow-lg rounded-t-lg overflow-hidden">
          <Link href={`/artists/${tracks?.[0]?.artist?.slug}`}>
            <div className="flex justify-start items-center space-x-4">
              {tracks?.[0]?.artist ? (
                <Image
                  src={tracks[0].artist?.image}
                  alt={tracks[0].artist?.display_name}
                  height={80}
                  width={80}
                  className="aspect-square object-cover h-20 w-20"
                  priority
                />
              ) : (
                <div>
                  <Music size={80}/>
                </div>
              )}
              <div>
                <h5 className="text-xs font-normal text-white">From the all albums</h5>
                <h2 className="text-white text-lg font-semibold hover:underline">
                  {tracks?.[0]?.artist?.display_name}
                </h2>
              </div>
            </div>
          </Link>
        </header>
      )}

      {showHeader && (
        <>
          <header className="grid grid-cols-12 p-4 pb-1 mb-2 text-white/60">
            {showIndex && (
              <div className="text-left ml-1 uppercase">
                #
              </div>
            )}
            <div
              className={`${(showAlbum || showPlaysCount) ? (showIndex ? "col-span-6" : "col-span-7") : (showIndex ? "col-span-10" : "col-span-11")} text-sm text-left`}
            >
              Title
            </div>

            {showAlbum && (
              <div className="col-span-4 text-sm text-left">
                Album
              </div>
            )}

            {showPlaysCount && (
              <div className="col-span-4 text-sm text-left">
                PlaysCount
              </div>
            )}

            <div className="col-span-1 ml-2 flex justify-center">
              <Clock3 size={16}/>
            </div>
          </header>

          {/* Divider */}
          <div className="col-span-12 border-b border-[#404040]/80"></div>
        </>
      )}

      {/* Table Rows */}

      <div className="w-full col-span-12">
        {tracks?.map((track, index) => (
          <div
            className={`grid py-2 px-4 rounded-md grid-cols-12 group/item ${
              hoveredRow === index ? "bg-white/10 duration-300 transition" : "bg-transparent"
            }`}
            key={track.id}
            onMouseEnter={() => {
              setHoveredTrackSlug(track.slug)
              setHoveredRow(index)
            }}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {showIndex && (
              <span className="flex items-center col-span-1 text-sm text-white/60">
                {hoveredRow === index || activeTrack?.slug === track.slug ? (
                  <PlayTrackButton track={track} tracks={tracks} index={index} lines={true} className="text-xl w-1/2"/>
                ) : (
                  <span className="ml-1">{index + 1}</span>
                )}
              </span>
            )}

            <div
              className={`${showAlbum || showPlaysCount ? (showIndex ? "col-span-6" : "col-span-7") : (showIndex ? "col-span-10" : "col-span-11")} flex items-center w-full`}
            >
              <div className="flex items-center w-full gap-3">
                {showCover && (
                  <div className="relative flex-shrink-0 w-10 h-10">
                    {track.album.image && track.album.image.length > 0 ? (
                      <Image
                        src={track.album.image}
                        alt={track.title}
                        height={40}
                        width={40}
                        className="object-contain w-10 h-10 rounded"
                      />
                    ) : (
                      <Music
                        size={16}
                        className="w-10 h-10 p-2 rounded bg-paper-secondary"
                      />
                    )}
                    {!showIndex && hoveredRow === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                        <PlayTrackButton track={track} tracks={tracks} index={index} lines={true} className="text-xl"/>
                      </div>
                    )}
                  </div>
                )}

                <div className="w-full pr-3 truncate flex items-center justify-between">
                  <div>
                    <Link
                      href={`/tracks/${track.slug}`}
                      className={`w-10/12 text-sm font-medium truncate cursor-pointer hover:underline ${
                        activeTrack?.slug === track.slug && "text-green-500"}`}
                    >
                      {track.title}
                    </Link>

                    {showSubtitle && (
                      <div
                        className="flex flex-wrap items-center w-full gap-1 pr-3 text-sm text-white/60 group-hover/item:text-white">
                      <span className="truncate">
                          <Link
                            key={track.artist.id + track.id}
                            href={`/artists/${track.artist.slug}`}
                            className="hover:text-white hover:underline"
                          >
                            {track.artist.display_name}
                          </Link>
                      </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {showAlbum && (
              <div className="flex items-center justify-between w-full col-span-4 text-sm text-white/60">
                <Link
                  href={`/albums/${track.album.slug}`}
                  className="truncate hover:text-white hover:underline"
                >
                  {track.album.title}
                </Link>
              </div>
            )}

            {showPlaysCount && (
              <div className="flex items-center w-10/12 col-span-3 text-sm text-white/60">
                <h1 className="group-hover/item:text-white">
                  {track.plays_count.toLocaleString()}
                </h1>
              </div>
            )}

            <div className="col-span-1 flex items-center justify-end">
              <small className="flex items-center justify-between w-full">

                {/* Khu vực nút Add - tách riêng */}
                {showAddToPlaylist && (
                  <div className="ml-4 mr-2">
                    <Popover open={openPopover === index} onOpenChange={(open) => setOpenPopover(open ? index : null)}>
                      <PopoverTrigger asChild>
                        <Button
                          size='sm'
                          variant='outline'
                          className="bg-opacity-0 text-xs h-7 min-w-[40px] px-2 text-white border-white hover:scale-105 transition duration-150 font-semibold opacity-0 group-hover/item:opacity-100"
                        >
                          {(isLoadingAddTP && (hoveredRow === index)) ? <Loader className="h-3 w-3"/> : "Add"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0 bg-zinc-900 border-zinc-700 text-white">
                        <Command className="bg-transparent">
                          <CommandInput placeholder="Search playlists..." className="text-white bg-zinc-800" />
                          <CommandEmpty className="text-white">No playlist found.</CommandEmpty>
                          <CommandGroup className="text-white">
                            <CommandList>
                              {myPlaylists?.results?.map((playlist) => (
                                <CommandItem
                                  value={playlist.title}
                                  key={playlist.id}
                                  onSelect={() => {
                                    handleAddToPlaylist(
                                      new MouseEvent('click') as unknown as React.MouseEvent<HTMLButtonElement>, 
                                      track.slug, 
                                      playlist.slug
                                    );
                                    setOpenPopover(null); // Close popover after selection
                                  }}
                                  className="text-white hover:bg-white/10"
                                >
                                  <Check
                                    className={cn(
                                      "mr-1 h-4 w-4",
                                      playlist.slug === selectedPlaylistSlug
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {playlist.image && (
                                    <Avatar className="rounded-md mr-2">
                                      <AvatarImage src={playlist.image}
                                                  className="aspect-square object-cover h-8 w-8 rounded-md"/>
                                      <AvatarFallback className="h-8 w-8 rounded-md bg-zinc-700">
                                        {playlist.title.substring(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  {playlist.title}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Hiển thị thời lượng track */}
                <div className="flex items-center justify-center m-4">
                  <span className="mx-auto">{formatTime(track.duration)}</span>
                </div>
                
                {/* TrackDialogDropdown */}
                <div>
                  <TrackDialogDropdown 
                    showRemoveTrack={showRemoveTrack} 
                    track={track} 
                    playlistSlug={playlistSlug}
                  />
                </div>
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
