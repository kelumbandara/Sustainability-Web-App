import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrganization } from '../api/OrganizationSettings/organizationSettingsApi';

export function useCurrentOrganization() {
  const { data } = useQuery<any[]>({
    queryKey: ['organization'],
    queryFn: getOrganization,
  });

  return {
    organizationName: data?.[0]?.organizationName ?? 'Hi',
    organizationLogo: data?.[0]?.logoUrl?.signedUrl,
  };
}

export function OrganizationHeadSetter() {
  const { organizationName, organizationLogo } = useCurrentOrganization();
  
  useEffect(() => {
    document.title = organizationName;
    if (organizationLogo) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = organizationLogo;
    }
  }, [organizationName, organizationLogo]);
  
  return null;
}

