export const getUrlPrefix = ({ cityId, outpostId }: { cityId?: string | null, outpostId?: string | null}): string => {
  return cityId ? `/city/${cityId}`: outpostId ? `/outpost/${outpostId}`: ''
}
