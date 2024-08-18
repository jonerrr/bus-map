import geopandas as gpd
from shapely.ops import snap
from tqdm import tqdm

df: gpd.GeoDataFrame = gpd.read_file("http://localhost:3055/bus/routes/geojson")

# df = df[df["id"].isin(["B54", "M90"])]

# print(df)
# quit()
# df_cl = gpd.read_file("./CSCL.geojson")
df_cl = gpd.read_file(
    "https://data.cityofnewyork.us/api/geospatial/exjm-f27b?method=export&format=GeoJSON"
)

df = df.to_crs(2263)
df_cl = df_cl.to_crs(2263)

snapped_geometries = []


for line in tqdm(df.geometry, desc="Snapping lines"):
    # Find the closest line in df_cl
    closest_line = df_cl.geometry.distance(line).idxmin()
    snapped_line = snap(
        line, df_cl.geometry[closest_line], tolerance=50
    )  # Adjust tolerance as needed
    snapped_geometries.append(snapped_line)

# Update the geometry of df with the snapped lines
df.geometry = snapped_geometries

df = df.to_crs(4326)

# Save or further process the snapped GeoDataFrame
df.to_file("snapped_routes.geojson", driver="GeoJSON")
