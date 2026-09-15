#!/usr/bin/env bash
# render.sh — Build HTML tu content/ roi xuat PNG do phan giai 2x vao out/
# Dung:  ./render.sh            -> render tat ca
#        ./render.sh react-01   -> chi render file khop ten
set -euo pipefail
cd "$(dirname "$0")"

CHROME="${CHROME:-google-chrome}"
W=1080                  # be ngang co dinh
H_COVER=1350            # kho bia co dinh 4:5
H_PROBE=2600            # khung render tam cho the noi dung (cao du cho moi the)
CHROME_PAD=87           # Chrome headless mat 87px cuoi khung -> render du roi cat lai
FILTER="${1:-}"

node build.mjs
mkdir -p out

n=0; warns=0
for f in src/*.html; do
  name="$(basename "$f" .html)"
  [[ -n "$FILTER" && "$name" != *"$FILTER"* ]] && continue

  if [[ "$name" == *"-00-cover" ]]; then
    H=$H_COVER                          # bia: kho co dinh
  else
    # The noi dung: chay 1 luot do chieu cao that (trang tu ghi vao <title>)
    dom="$("$CHROME" --headless --disable-gpu --no-sandbox --virtual-time-budget=4000 \
           --dump-dom "file://$PWD/$f" 2>/dev/null)"
    H="$(sed -n 's/.*<title>H=\([0-9]*\).*<\/title>.*/\1/p' <<<"$dom" | head -1)"
    WARN="$(sed -n 's/.*<title>.*;WARN=\([^<]*\)<\/title>.*/\1/p' <<<"$dom" | head -1)"
    [[ -n "$WARN" ]] && echo "  ⚠ $name: $WARN" && warns=$((warns+1))
    [[ -z "$H" ]] && { echo "  ! khong do duoc chieu cao $name, bo qua"; continue; }
    (( H > H_PROBE - CHROME_PAD )) && { echo "  ! $name cao $H px, vuot khung $H_PROBE"; continue; }
  fi

  [[ "$W" =~ ^[0-9]+$ && "$H" =~ ^[0-9]+$ ]] || { echo "! kich thuoc sai: W=$W H=$H"; exit 1; }

  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
            --force-device-scale-factor=2 \
            --virtual-time-budget=4000 \
            --window-size=$W,$((H + CHROME_PAD)) \
            --screenshot="out/$name.png" \
            "file://$PWD/$f" >/dev/null 2>&1
  node crop.mjs "out/$name.png" $((H * 2))          # cat bo dai trang thua
  echo "  → out/$name.png  (${W}x${H} @2x)"
  n=$((n+1))
done
echo "${warns:-0} canh bao bo cuc"
echo "✓ Xuat xong $n anh @2x — bia ${W}x${H_COVER}, the noi dung tu co theo noi dung, trong out/"
