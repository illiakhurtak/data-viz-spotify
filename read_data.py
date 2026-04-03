import kagglehub

# Download latest version
path = kagglehub.dataset_download("yamaerenay/spotify-dataset-1921-2020-160k-tracks")

print("Path to dataset files:", path)