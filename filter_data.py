import pandas as pd

df = pd.read_csv('tracks.csv')

target_artists = ["My Chemical Romance", "Blink-182", "Sum 41", "Coldplay"]

filtered_df = df[df['artists'].str.contains('|'.join(target_artists), case=False, na=False)]

filtered_df.to_csv('tracks_light.csv', index=False)

print(f"Готово! Новий файл tracks_light.csv створено. Рядків: {len(filtered_df)}")