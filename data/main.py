import pandas as pd
import geopandas as gpd
import requests


def read_routes():
    # gdf: gpd.GeoDataFrame = gpd.read_file("shapefiles/routes.shp")
    # print(gdf[["id", "longName"]])
    # gdf = gdf.drop(columns=["id"])

    r = requests.get("http://localhost:3055/bus/routes?geom=true").json()

    df = pd.json_normalize(r)
    df = df.explode("geom")
    print(df.dtypes)
    quit()
    # merge gdf and df on longName
    # df = df.rename(
    #     columns={
    #         "long_name": "longName",
    #         # "descriptio": "description",
    #     }
    # )
    # gdf = gdf.merge(df, on="longName")
    # gdf = gdf.drop(columns=["short_name"])

    # gdf = gpd.GeoDataFrame(gdf)
    # print(gdf.columns)

    # # add a hashtag to the start of each color
    # gdf["color"] = "#" + gdf["color"]

    # gdf.to_file(r"../static/routes.geojson", driver="GeoJSON")


def read_stops():
    r = requests.get("https://trainstat.us/api/bus/stops").json()

    df = pd.json_normalize(r, max_level=2)
    # normalize json
    # df = pd.json_normalize(df)
    # flatten routes object and combine into list of strings by id
    df["routes"] = df["routes"].apply(lambda x: ", ".join([i["id"] for i in x]))

    # convert to gdf using lat, lon columns
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df["lon"], df["lat"]))
    print(gdf)
    gdf.to_file(r"../static/stops.geojson", driver="GeoJSON")


if __name__ == "__main__":
    read_routes()
    # read_stops()
