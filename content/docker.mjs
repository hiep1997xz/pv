/**
 * Noi dung cum DOCKER — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'docker',
  kicker: '( Cẩm nang )',
  title: 'Docker',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Từ Cơ Bản đến Nâng Cao',
  toc: [
    ['🐳', 'Container vs máy ảo · Kernel chung', 'Junior'],
    ['📦', 'Image · Layer · Cache build', 'Junior'],
    ['📝', 'Dockerfile & .dockerignore', 'Junior'],
    ['⌨️', 'CLI hằng ngày · Gỡ rối nhanh', 'Junior'],
    ['🏗️', 'Multi-stage build · Giảm size', 'Mid'],
    ['💾', 'Volume · Bind mount · Dữ liệu', 'Mid'],
    ['🔗', 'Networking · DNS nội bộ', 'Mid'],
    ['🧩', 'Docker Compose · Healthcheck', 'Senior'],
    ['🔐', 'Bảo mật · Non-root · Secret', 'Senior'],
    ['🚀', 'Registry · CI/CD · Production', 'Senior'],
    ['🐞', 'Lỗi thường gặp & cách xử lý', 'All'],
    ['💬', 'Câu hỏi thật theo từng cấp độ', 'All'],
  ],
  sticky: ['Giải thích dễ hiểu', 'Có code thật', 'Bẫy phỏng vấn', 'Câu trả lời mẫu'],
  chips: [
    ['Khái niệm', '#DCE9FF'],
    ['Code mẫu', '#D6F5E3'],
    ['Bẫy thường gặp', '#FFDCD4'],
    ['Câu hỏi thật', '#FFE9C7'],
    ['Mẹo ghi điểm', '#F3DDFF'],
  ],
  note: 'Container <em>không phải</em> máy ảo nhẹ.<br>Hiểu “kernel chung” là trả lời được nửa số câu. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Container vs máy ảo · Image vs Container',
    questions: [
      'Container khác máy ảo ở điểm nào?',
      'Image và container khác nhau thế nào?',
    ],
    points: [
      'Container <b>không có kernel riêng</b>. Nó dùng chung kernel của host, chỉ bị cô lập bằng <b>namespace</b> (thấy được gì) và <b>cgroup</b> (dùng được bao nhiêu CPU/RAM).',
      'Máy ảo phải bật cả một hệ điều hành đầy đủ — nặng vài GB, khởi động vài chục giây. Container chỉ là một tiến trình — vài chục MB, bật trong mili giây.',
      '<b>Image</b> là bản đóng gói chỉ đọc, xếp thành nhiều <b>layer</b>. <b>Container</b> = image + một layer ghi được nằm trên cùng.',
      'Xoá container là mất sạch layer ghi đó. Thứ gì cần sống lâu hơn container thì phải nằm ở <b>volume</b>.',
      'Một image chạy được nhiều container độc lập, và các container <b>dùng chung</b> layer chỉ đọc nên tốn rất ít đĩa.',
    ],
    code: `docker run -d --name web -p 8080:80 nginx:1.27-alpine
docker ps            # container đang chạy
docker images        # image đang có trên máy

# ❌ sửa file trong container rồi tưởng là đã lưu
docker exec -it web sh -c 'echo hi > /tmp/a.txt'
docker rm -f web     # xoá container → mất luôn /tmp/a.txt

# ✅ muốn giữ dữ liệu thì gắn volume vào
docker run -d --name web -v web-data:/data nginx:1.27-alpine`,
    trap: 'Câu vặn hay gặp: container có phải máy ảo siêu nhẹ không? → <b>Không</b>. Nó là tiến trình của host và dùng chung kernel. Nên image Linux không chạy thẳng trên Windows hay macOS — phải có một lớp máy ảo Linux ở giữa.',
    tip: 'Nêu được ba thứ dựng nên container: <b>namespace</b> cô lập tầm nhìn, <b>cgroup</b> giới hạn tài nguyên, <b>union filesystem</b> xếp layer. Trả lời đúng ba từ này là qua được câu mở màn.',
  },
  {
    id: '02', level: 'junior', title: 'Dockerfile · Layer cache',
    questions: [
      'Vì sao COPY package.json phải đứng trước COPY . ?',
      'Thứ tự lệnh trong Dockerfile ảnh hưởng gì?',
    ],
    points: [
      'Mỗi lệnh <code>RUN</code>, <code>COPY</code>, <code>ADD</code> tạo một <b>layer</b>. Docker cache từng layer, và <b>một layer đổi là mọi layer sau nó mất cache</b>.',
      'Xếp từ <b>ít đổi đến hay đổi</b>: gói hệ thống → thư viện → mã nguồn. Copy mã nguồn lên trước thì sửa một dòng cũng phải cài lại toàn bộ dependency.',
      'Copy <code>package.json</code> rồi <code>npm ci</code> trước, sau đó mới <code>COPY . .</code> — sửa code không làm mất cache của bước cài.',
      '<code>.dockerignore</code> phải có <code>node_modules</code>, <code>.git</code>, <code>.env</code>. Vừa nhẹ build context, vừa tránh lộ bí mật vào image.',
      'Dọn dẹp phải <b>cùng một layer</b> với lúc cài. Xoá ở layer sau thì file vẫn nằm trong layer trước, image không nhẹ đi chút nào.',
    ],
    code: `FROM node:22-alpine
WORKDIR /app

# ✅ lớp ít đổi nằm trên → sửa code không phải cài lại
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
CMD ["node", "dist/index.js"]

# ❌ copy hết lên trước → đổi 1 dòng code là npm ci chạy lại
# COPY . .
# RUN npm ci`,
    trap: 'Xoá file ở layer sau <b>không</b> làm image nhẹ đi — layer trước vẫn giữ nguyên file đó. Bí mật lỡ <code>COPY</code> vào rồi <code>RUN rm</code> thì vẫn moi lại được bằng <code>docker history</code>.',
    tip: 'Phân biệt được <code>CMD</code> và <code>ENTRYPOINT</code>: ENTRYPOINT là lệnh cố định, CMD là tham số mặc định, ghi đè được khi <code>docker run</code>. Luôn dùng dạng mảng để tiến trình nhận được tín hiệu dừng.',
  },
  {
    id: '03', level: 'junior', title: 'CLI hằng ngày · Gỡ rối nhanh',
    questions: [
      'Container chết ngay khi khởi động, bạn làm gì?',
      'stop khác kill và rm thế nào?',
    ],
    points: [
      'Việc đầu tiên luôn là <code>docker logs --tail 100 -f</code>. Đừng đoán khi log đang nằm sẵn ở đó.',
      '<code>docker ps</code> chỉ thấy container đang chạy — phải <code>docker ps -a</code> mới thấy cái đã chết, kèm exit code ở cột STATUS.',
      '<code>docker exec</code> chỉ vào được container <b>đang chạy</b>. Container chết ngay thì soi image bằng <code>docker run --rm -it &lt;image&gt; sh</code>.',
      '<code>stop</code> gửi <code>SIGTERM</code> rồi chờ 10 giây mới <code>SIGKILL</code>. <code>kill</code> bắn SIGKILL ngay. <code>rm</code> xoá container đã dừng.',
      '<code>docker inspect</code> xem cấu hình thật đang chạy (mount, network, env), <code>docker stats</code> xem CPU/RAM theo thời gian thực.',
    ],
    code: `docker logs --tail 100 -f web    # ✅ xem lỗi trước tiên
docker ps -a                     # thấy cả container đã chết
docker inspect web | less        # mount, network, env thật

# chui vào container đang chạy
docker exec -it web sh

# container chết ngay → mở shell tạm trên chính image đó
docker run --rm -it node:22-alpine sh

docker system df                 # đĩa đang bị gì chiếm
docker system prune -a --volumes # ❌ xoá cả volume, mất data`,
    trap: '<code>docker system prune -a</code> kèm <code>--volumes</code> xoá luôn <b>volume</b> — tức là mất sạch dữ liệu database trên máy dev. Rất nhiều người chạy lệnh này cho nhẹ đĩa rồi mới phát hiện mất data.',
    tip: 'Đọc được exit code: <code>137</code> là bị SIGKILL, thường do hết RAM. Xác nhận bằng <code>.State.OOMKilled</code> trong <code>docker inspect</code>. <code>139</code> là segfault, <code>1</code> là app tự thoát vì lỗi.',
  },
  {
    id: '04', level: 'mid', title: 'Multi-stage build · Giảm kích thước image',
    questions: [
      'Multi-stage build giải quyết vấn đề gì?',
      'Làm sao giảm image 1.2GB xuống vài chục MB?',
    ],
    points: [
      'Một stage để build (có compiler, devDependencies), một stage để chạy chỉ copy <b>kết quả</b> sang. Công cụ build không lọt vào image cuối.',
      '<code>COPY --from=builder</code> chỉ lấy đúng thứ cần: thư mục <code>dist</code>, binary đã compile, hoặc <code>node_modules</code> bản production.',
      'Base image nhẹ dần: <code>node:22</code> khoảng 1.1GB → <code>node:22-alpine</code> khoảng 150MB → <b>distroless</b> hoặc <code>scratch</code> cho binary Go/Rust, chỉ vài chục MB.',
      'Image nhỏ không chỉ đỡ tốn đĩa: kéo về nhanh hơn, deploy nhanh hơn, và <b>ít lỗ hổng hơn</b> vì không còn shell, package manager hay compiler để mà khai thác.',
      'Cần debug stage giữa thì dừng lại ở đó bằng <code>docker build --target builder</code>.',
    ],
    code: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                  # có devDependencies để build
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev       # ✅ chỉ dependency chạy thật
COPY --from=builder /app/dist ./dist
USER node                   # ✅ không chạy bằng root
CMD ["node", "dist/index.js"]`,
    trap: 'Chỉ đổi sang <code>alpine</code> chưa chắc đủ. Nếu stage chạy vẫn <code>npm ci</code> đầy đủ cả devDependencies thì image vẫn phình. Phải <b>tách stage</b> thì công cụ build mới thật sự không lọt vào image cuối.',
    tip: 'Alpine dùng <b>musl</b> thay cho glibc, nên vài thư viện native như sharp, bcrypt, canvas có thể lỗi hoặc chậm bất thường. Gặp vấn đề thì đổi sang <code>node:22-slim</code> chứ đừng cố vá.',
  },
  {
    id: '05', level: 'mid', title: 'Volume · Bind mount · Dữ liệu',
    questions: [
      'Dữ liệu đi đâu khi bạn xoá container?',
      'Named volume khác bind mount chỗ nào?',
    ],
    points: [
      'Layer ghi của container là <b>tạm</b>. Xoá container là mất. Mọi thứ cần sống lâu hơn container phải nằm ngoài nó.',
      '<b>Named volume</b> do Docker quản lý, nằm ở khu vực riêng, sao lưu và di chuyển dễ. Đây là lựa chọn cho database ở mọi môi trường.',
      '<b>Bind mount</b> trỏ thẳng vào thư mục máy thật — dùng cho <b>dev</b> để sửa code thấy ngay. Không nên dùng ở production vì phụ thuộc cấu trúc thư mục máy chủ.',
      '<b>tmpfs</b> nằm trong RAM và mất khi container dừng — hợp cho file tạm và dữ liệu nhạy cảm không được chạm đĩa.',
      'Bind mount hay vỡ vì <b>quyền</b>: tiến trình trong container chạy bằng UID khác chủ sở hữu thư mục trên host, thành ra permission denied.',
    ],
    code: `# ✅ database: named volume, Docker tự quản lý
docker run -d -v pgdata:/var/lib/postgresql/data postgres:17

# ✅ dev: bind mount để sửa code là thấy ngay
docker run -v "$PWD/src:/app/src" -p 3000:3000 myapp

# ❌ bind mount đè mất node_modules đã cài trong image
docker run -v "$PWD:/app" myapp
# ✅ chừa node_modules ra bằng một volume ẩn danh
docker run -v "$PWD:/app" -v /app/node_modules myapp

# sao lưu volume ra file tar
docker run --rm -v pgdata:/d -v "$PWD:/b" alpine \\
  tar czf /b/backup.tgz -C /d .`,
    trap: 'Bind mount cả thư mục dự án vào <code>/app</code> sẽ <b>đè lên</b> <code>node_modules</code> đã cài trong image — container chạy lên báo thiếu module dù Dockerfile cài rồi. Chữa bằng cách chừa thư mục đó ra bằng volume ẩn danh.',
    tip: 'Nêu được thứ tự chọn: named volume cho dữ liệu thật, bind mount chỉ cho dev, tmpfs cho thứ không được chạm đĩa. Và volume <b>không</b> mất khi <code>docker rm</code> — phải <code>docker volume rm</code> mới xoá.',
  },
  {
    id: '06', level: 'mid', title: 'Networking · DNS nội bộ',
    questions: [
      'Trong container, localhost trỏ vào đâu?',
      'Hai container gọi được nhau bằng cách nào?',
    ],
    points: [
      'Mỗi container có network namespace riêng, nên <code>localhost</code> bên trong là <b>chính container đó</b> — không phải máy host, càng không phải container khác.',
      'Cùng một <b>user-defined network</b>, container gọi nhau bằng <b>tên</b> nhờ DNS nội bộ của Docker. Viết <code>db:5432</code> chứ không phải <code>localhost:5432</code>.',
      'Network <code>bridge</code> mặc định <b>không</b> có DNS theo tên. Compose tự tạo network riêng nên trong Compose gọi tên service là chạy được ngay.',
      '<code>-p 8080:80</code> là <b>host:container</b>. Còn <code>EXPOSE</code> trong Dockerfile chỉ là ghi chú, tự nó không mở cổng nào cả.',
      'Cần gọi ngược về máy host thì dùng <code>host.docker.internal</code>. Trên Linux phải thêm <code>--add-host</code> trỏ tới <code>host-gateway</code>.',
    ],
    code: `docker network create app-net
docker run -d --name db  --network app-net postgres:17
docker run -d --name api --network app-net myapi

# ✅ trong container api, kết nối bằng TÊN container
#    DATABASE_URL=postgres://user:pass@db:5432/mydb

# ❌ localhost trong api là chính api, không phải db
#    DATABASE_URL=postgres://user:pass@localhost:5432/mydb

docker run -p 8080:80 nginx      # host 8080 → container 80
docker network inspect app-net   # ai đang trong network này`,
    trap: 'Lỗi kinh điển khi đưa app lên Docker: giữ nguyên <code>localhost</code> trong connection string. Chạy ở máy thì được, vào container là <b>connection refused</b>, vì localhost giờ là chính container chứ không còn là máy bạn.',
    tip: 'Nói thêm ở mức production: đặt database vào network <code>internal: true</code> để nó không ra được internet, chỉ app trong cùng network gọi vào được. Và đừng <code>-p</code> cổng database ra host.',
  },
  {
    id: '07', level: 'senior', title: 'Docker Compose · Nhiều môi trường',
    questions: [
      'depends_on có đảm bảo database đã sẵn sàng không?',
      'Tách cấu hình dev và production thế nào?',
    ],
    points: [
      '<code>depends_on</code> mặc định chỉ đợi container <b>khởi động</b>, không đợi dịch vụ <b>nhận được kết nối</b>. Phải thêm <code>healthcheck</code> và <code>condition: service_healthy</code>.',
      'Kể cả có healthcheck, app vẫn nên <b>tự retry</b> khi kết nối DB. Container có thể bị khởi động lại bất cứ lúc nào, không chỉ lúc mới bật.',
      'Tách file: <code>compose.yaml</code> là phần chung, <code>compose.override.yaml</code> tự nạp cho dev, production chạy với <code>-f</code> chỉ rõ từng file.',
      'Biến môi trường để trong <code>env_file</code>, và file <code>.env</code> <b>không bao giờ</b> commit. Bí mật thật thì dùng <code>secrets</code>, đừng nhét vào <code>environment</code>.',
      '<code>profiles</code> để bật tắt dịch vụ phụ như worker hay mail server mà không cần đẻ thêm file compose riêng.',
    ],
    code: `services:
  db:
    image: postgres:17
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10
  api:
    build: .
    depends_on:
      db:
        condition: service_healthy   # ✅ đợi DB sẵn sàng thật
    env_file: [.env]
    restart: unless-stopped`,
    trap: '<code>depends_on</code> không đợi dịch vụ sẵn sàng, nó chỉ đợi container bật lên. API khởi động trước khi Postgres nhận kết nối là crash ngay. Trả lời thiếu ý này là mất điểm ở đúng câu Compose.',
    tip: 'Phân biệt <code>restart: unless-stopped</code> và <code>always</code>: unless-stopped sẽ không tự bật lại nếu bạn chủ động dừng container. Và <code>docker compose</code> v2 có dấu cách đã thay <code>docker-compose</code> cũ.',
  },
  {
    id: '08', level: 'senior', title: 'Bảo mật · Production',
    questions: [
      'Vì sao không nên chạy container bằng root?',
      'Đưa secret vào container thế nào cho an toàn?',
    ],
    points: [
      'Mặc định tiến trình trong container là <b>root</b>. Thoát được container là thành root trên host. Luôn tạo user thường và thêm <code>USER</code> trong Dockerfile.',
      '<b>Không</b> đặt secret vào <code>ENV</code> hay <code>ARG</code> — chúng nằm lại trong <code>docker history</code>, ai đọc được image là đọc được. Mount file lúc chạy hoặc dùng secret của orchestrator.',
      'Ghim base image theo <b>digest</b> chứ đừng dùng <code>latest</code>. <code>latest</code> hôm nay và tháng sau là hai image hoàn toàn khác nhau.',
      'Siết quyền lúc chạy: <code>--read-only</code>, <code>--cap-drop ALL</code> rồi thêm lại đúng quyền cần, và đặt giới hạn <code>--memory</code>, <code>--cpus</code>.',
      'Quét lỗ hổng ngay trong CI trước khi push: <code>docker scout cves</code> hoặc <code>trivy image</code>. Đừng để tới lúc đã lên production mới quét.',
    ],
    code: `# --- Dockerfile ---
FROM node:22-alpine
RUN addgroup -S app && adduser -S app -G app
USER app                    # ✅ không chạy bằng root
HEALTHCHECK CMD wget -qO- localhost:3000/health || exit 1
CMD ["node", "dist/index.js"]

# ❌ secret nằm lại trong docker history, ai có image là đọc được
# ENV API_KEY=sk_live_abc123

# --- lúc chạy: siết quyền, mount secret dạng file ---
docker run --read-only --cap-drop ALL --memory 512m \\
  -v app-secrets:/run/secrets:ro myapp

docker scout cves myapp     # quét trước khi push lên registry`,
    trap: 'Đừng trả lời “container cô lập rồi thì chạy root cũng không sao”. Container <b>dùng chung kernel</b> với host — root trong container là root thật, chỉ đang bị namespace che. Thoát ra được là chiếm luôn máy chủ.',
    tip: 'Nêu được vấn đề <b>PID 1</b>: tiến trình chạy ở PID 1 không có handler mặc định cho <code>SIGTERM</code>, nên <code>docker stop</code> phải chờ hết 10 giây rồi mới giết. Tự bắt tín hiệu, hoặc chạy với <code>--init</code>.',
  },
];
