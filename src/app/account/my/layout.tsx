"use client";

import {Separator} from "@/components/ui/separator"
import {SidebarNav} from "@/components/forms/components/sidebar-nav"
import ProtectRouter from "@/components/utils/ProtectRouter";
import {useRetrieveUserMeQuery} from "@/lib/features/auth/authApiSlice";
import {Skeleton} from "@/components/ui/skeleton";
import Header from "@/components/general/Header";
import ContentSection from "@/components/general/content-section";
import {
  accountMyArtistAlbumsUrl,
  accountMyArtistTracksUrl,
  accountMyProfileArtistUrl,
  accountMySettingsUrl,
  accountMyUrl, profileMyUrl
} from "@/utils/consts";
import {useAppSelector} from "@/lib/hooks";
import {Button} from "@/components/ui/button";
import Link from "next/link";


interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({children}: SettingsLayoutProps) {
  const {isAuthenticated} = useAppSelector(state => state.auth)
  const {data: user, isLoading, isFetching} = useRetrieveUserMeQuery({}, {skip: !isAuthenticated});

  let sidebarNavItems: { href: string; title: string; }[] = [];
  if (user?.type_profile === "User") {
    sidebarNavItems = [
      {
        title: "Account",
        href: accountMyUrl,
      },
      {
        title: "Profile",
        href: profileMyUrl,
      },
      {
        title: "Settings",
        href: accountMySettingsUrl,
      },
    ]
  } else if (user?.type_profile === "Artist") {
    sidebarNavItems = [
      {
        title: "Account",
        href: accountMyUrl,
      },
      {
        title: "Artist profile",
        href: accountMyProfileArtistUrl,
      },
      {
        title: "Artist tracks",
        href: accountMyArtistTracksUrl,
      },
      {
        title: "Artist albums",
        href: accountMyArtistAlbumsUrl,
      },
      {
        title: "Settings",
        href: accountMySettingsUrl,
      },
    ]
  }

  let loader = null;
  if (isLoading || isFetching) {
    loader = (
      <div className='mt-2 space-y-4'>
        <Skeleton className="h-10 w-52 rounded-2xl"/>
        <Skeleton className="h-10 w-52 rounded-2xl"/>
        <Skeleton className="h-10 w-52 rounded-2xl"/>
        <Skeleton className="h-10 w-52 rounded-2xl"/>
        <Skeleton className="h-10 w-52 rounded-2xl"/>
        <Skeleton className="h-10 w-52 rounded-2xl"/>
      </div>
    )
  }


  return (
    <ProtectRouter allowedRoles={['User', 'Artist']}>
      <Header/>
      <ContentSection>
        <div className="mx-auto space-y-6 p-6 pb-10 lg:max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">My account</h2>
              <p className="text-muted-foreground">
                Manage your account settings.
              </p>
            </div>
            <Link href={`/`}>
              <Button variant="outline" className="hover:scale-105 transition duration-150 text-white">
                Go home
              </Button>
            </Link>
          </div>
          <Separator className="my-6"/>
          <div className="flex flex-col space-y-8">
            <aside>
              {loader ||
                <SidebarNav items={sidebarNavItems}/>
              }
            </aside>
            <div className="flex item-center justify-center w-full">
              <div className="flex-1 justify-center lg:max-w-4xl">{children}</div>
            </div>
          </div>
        </div>
      </ContentSection>
    </ProtectRouter>
  )
}
