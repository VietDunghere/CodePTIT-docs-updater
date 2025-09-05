# CODE PTIT DOCS UPDATER VERSION 1.0

> Chạy KPI CodePTIT

@Author: [BidenJr](https://github.com/HungNguyenBa1811)

@Version: 1.0

Đảm bảo đã cài đặt sẵn NodeJS v20 trở lên

### Installation:

- Install package

1. PULL CODE

Clone code về bằng cách tải Zip hoặc chạy cli:

```git clone https://github.com/HungNguyenBa1811/CodePTIT-docs-updater.git```

sau đó mở thư mục chứa code (chứa file ``.env``) trong VSCode


Cài đặt các lib cần thiết để chạy tool:

```sh
npm i
```

### Config

Tạo & Mở file ``.env``
```
CODEPTIT_USERNAME=
CODEPTIT_PASSWORD=
COURSE_ID=
DOC_ID=
```

và bổ sung file service-account.json vào trong src/resources/

Mô tả:
- ``CODEPTIT_USERNAME`` : Tên đăng nhập codeptit
- ``CODEPTIT_PASSWORD`` : Mật khẩu đăng nhập
- ``COURSE_ID`` : Mã môn học
- ``DOC_ID`` : Mã Google Docs

Để lấy mã môn học, bạn có thể truy cập trang chủ codeptit (danh sách bài), ấn F12 (Developer Tool/ Inspect) > Console và paste đoạn mã sau:
```js
JSON.stringify(Array.from(document.querySelectorAll('select#course option')).filter(i => !!i.getAttribute('value')).map(i => ({
    name: i.text,
    course_id: i.getAttribute('value')
})))
```

và ấn enter, kết quả có dạng 
```
'[{"name":"Lập trình hướng đối tượng - Nhóm 12","course_id":"744"},{"name":"Lập trình với Python - Nhóm 08","course_id":"759"},{"name":"Thuật toán và ứng dụng nâng cao - Nhóm THUẬT TOÁN NÂNG CAO - 2024","course_id":"732"}]'
```
Lấy ``course_id`` tương ứng với tên môn và để vào ``.env``
Nếu không thấy ``course_id`` của môn bạn cần, hãy để rỗng

Để lấy mã Google Docs, hãy tạo 1 file Google Docs (nếu chưa có), bật Chia sẻ -> Người chỉnh sửa
Lấy ``doc_id`` tương ứng với phần ??? và để vào ``.env`` như trong ví dụ
```
https://docs.google.com/document/d/???/edit
```

Để lấy service-account.json, làm các bước sau:
1. **Tạo dự án Google Cloud:**
    - Truy cập [Google Cloud Console](https://console.cloud.google.com/).
    - Tạo mới dự án (Project) hoặc chọn một dự án hiện có.

2. **Kích hoạt Google Docs API:**
    - Trong bảng điều khiển dự án, mở menu “APIs & Services” > “Library”.
    - Tìm kiếm “Google Docs API” và nhấn “Enable” để kích hoạt.

3. **Tạo Service Account:**
    - Trong menu “APIs & Services” chọn “Credentials”.
    - Nhấn “Create Credentials” và chọn “Service account”.
    - Nhập tên và mô tả cho service account, nhấn “Create”.
    - (Tùy chọn) Gán quyền nếu cần, sau đó nhấn “Continue”.
    - Trong bước cuối, nhấn “Done”.

4. **Tải về File JSON Credentials vào src/resources/:**
    - Trong danh sách service accounts, tìm service account vừa tạo.
    - Nhấn vào biểu tượng ba chấm và chọn “Manage keys”.
    - Nhấn “Add key” > “Create new key”, chọn định dạng JSON và tải về file.
    - Lưu file JSON an toàn, file sẽ chứa thông tin xác thực cần thiết.

### Run tool

Chạy tool bằng lệnh

```sh
npm run start
```

Khi chạy code, nếu hiển thị đúng số lượng bài đã làm, ví dụ:
```
Login success!
> Total problems:  292
> Incomplete problems:  117
> Complete problems:  175
Rows Added!
Table Body Updated!
```
thì là đã thành công.

Nếu hiển thị lỗi, hãy báo cho BidenJr để biết cách fix!

##### Chúc bạn may mắn, không điền docs cô Liên cẩn thận tạch môn đấy!