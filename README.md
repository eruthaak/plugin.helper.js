# Helper.js

Bu yardımcı dosyası, jQuery tabanlı web projelerinde sık kullanılan form işlemlerini, AJAX davranışlarını, Bootstrap bileşenlerini ve UI yardımcılarını tek bir noktadan yönetmenizi sağlar. Projelerinize eklediğinizde, form verisi toplama, AJAX istekleri, toasts, Select2, DataTables ve Quill tasarımları için hızlı ve standart bir başlangıç altyapısı sunar.

## İçerik

- [Giriş](#giriş)
- [Özellikler](#özellikler)
- [Ön koşullar](#ön-koşullar)
- [Kurulum](#kurulum)
- [Temel kullanım](#temel-kullanım)
- [Form verisi alma: serializeObject](#form-verisi-alma-serializeobject)
- [AJAX yardımcıları](#ajax-yardımcıları)
- [Global Ajax ayarları](#global-ajax-ayarları)
- [GlobalConfig yardımcıları](#globalconfig-yardımcıları)
- [Uyarı ve toast ayarları](#uyarı-ve-toast-ayarları)
- [Örnekler](#örnekler)
- [Notlar ve dikkat edilmesi gerekenler](#notlar-ve-dikkat-edilmesi-gerekenler)

## Giriş

`helper.js`, projelerde tekrar eden işleri tek bir dosyada toplar. Özellikle şunlar için uygundur:

- form alanlarını obje olarak serialize etme
- AJAX öncesi butonları pasifleştirme ve tekrar aktif hale getirme
- Bootstrap modal/offcanvas kapanması
- sunucu yanıtlarına göre toast mesajları gösterme
- Select2, DataTables ve Quill için standart konfigürasyonlar üretme
- Bootstrap tooltip ve focus trap davranışlarını merkezileştirme

Bu dosya, genellikle Laravel, ASP.NET, Node veya statik HTML projelerinde kullanılacak şekilde tasarlanmıştır; temel şart jQuery ve bazı UI kütüphanelerinin yüklenmiş olmasıdır.

## Özellikler

### 1. Form serialize işlemi

`$.fn.serializeObject()` metodu, bir formu JavaScript nesnesine dönüştürür. Aşağıdaki durumları özel olarak ele alır:

- checkbox alanları: `true` / `false`
- radio alanları: seçili olan değeri alır
- select2 alanları: tek seçim ve çoklu seçim için uygun şekilde işler
- aynı name’e sahip birden çok alan: dizi olarak toplar
- hidden companion alanları / checkbox’a eşlik eden alanlar gibi durumları yönetir

### 2. AJAX hazırlanma ve tamamlanma yardımcıları

`$.fn.ajaxHelpers` içinde:

- butonları `data-ajax-setup` üzerinden devre dışı bırakır
- spinner ekler
- AJAX bitince eski içeriği geri yükler
- modal / offcanvas şablonlarını kapatır

### 3. Global AJAX yapılandırması

`$.ajaxSetup()` ile şu davranışlar tanımlanır:

- CSRF token meta etiketi üzerinden `X-CSRF-TOKEN` headers eklenir
- `beforeSend` ile buton durumunu yönetir
- `success` ile sunucu mesajlarını toast olarak gösterir
- `error` ile hata mesajlarını ayrıştırıp okunabilir biçimde gösterir

### 4. GlobalConfig yardımcıları

`window.GlobalConfig` içinde şunlar tanımlıdır:

- `Select2(conf)`
- `DataTable(conf)`
- `Quill(conf)`
- `Bootstrap()`

Bu fonksiyonlar, proje genelinde tutarlı bir tasarım ve davranış sağlar.

### 5. Bootstrap ve UI standartları

- tooltip otomatik başlatma
- modal/offcanvas focus trap için boş uygulanım
- DataTable hata modu `none`

## Ön koşullar

Bu yardımcı dosyayı kullanmak için aşağıdaki bağımlılıkların projede mevcut olması gerekir:

- jQuery
- Bootstrap 5 (özellikle tooltip, modal, offcanvas için)
- Toastr
- Select2 (opsiyonel ama serializeObject içinde desteklenir)
- DataTables (opsiyonel ama yapılandırma fonksiyonu vardır)
- Quill (opsiyonel ama yapılandırma fonksiyonu vardır)

Aşağıdaki örnek, etkin kullanım için gerekli yükleme sırasını gösterir:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/css/select2.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/datatables.net-bs5@1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css" rel="stylesheet">

<script src="https://code.jquery.com/jquery-3.12.12.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/datatables.net@1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/datatables.net-bs5@1.13.6/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js"></script>
<script src="/path/to/helper.js"></script>
```

> Not: `X-CSRF-TOKEN` kullanıyorsanız, sayfanızda buna benzer bir meta etiketi olmalıdır:
>
> ```html
> <meta name="X-CSRF-TOKEN" content="token-degeri">
> ```

## Kurulum

Projeye bu dosyayı eklemek çok basittir:

1. `helper.js` dosyasını projenizin `assets/js` veya benzeri bir klasörüne taşıyın.
2. jQuery ve gerekli UI kütüphanelerini sayfaya dahil edin.
3. `helper.js` dosyasını son script olarak ekleyin.
4. Gerekirse `window.GlobalConfig` üzerinden özel ayarlar verin.

```html
<script src="assets/js/helper.js"></script>
```

Dosya otomatik olarak `$` ve `window` ortamında çalışacak şekilde hazırlanmıştır; doğrudan bir `DOMContentLoaded` benzeri başlangıç kodu içerir.

## Temel kullanım

### 1. Formdan veri alma

```html
<form id="userForm">
  <input type="text" name="name">
  <input type="checkbox" name="isActive" checked>
  <select name="role" class="select2">
    <option value="admin">Admin</option>
    <option value="editor">Editör</option>
  </select>
</form>

<script>
  const data = $('#userForm').serializeObject();
  console.log(data);
</script>
```

Çıktı örneği:

```json
{
  "name": "Ahmet",
  "isActive": true,
  "role": "admin"
}
```

### 2. AJAX isteği

```javascript
$.ajax({
  url: '/api/users',
  method: 'POST',
  data: $('#userForm').serializeObject(),
  success: function (response) {
    console.log(response);
  }
});
```

Bu çağrı otomatik olarak:

- `data-ajax-setup` içeren butonları devre dışı bırakır
- başarılı/başarısız mesajları toast olarak gösterir
- AJAX sonrası modal/offcanvas’ları kapatır

## Form verisi alma: serializeObject

`serializeObject` metodunu kullanırken şu unsurları aklınızda tutun:

### Checkbox

```html
<input type="checkbox" name="status" checked>
```

Sonuç:

```json
{ "status": true }
```

### Radio

```html
<input type="radio" name="gender" value="male" checked>
<input type="radio" name="gender" value="female">
```

Sonuç:

```json
{ "gender": "male" }
```

### Select2 çoklu seçim

```html
<select name="roles" class="select2" multiple>
  <option value="1">Yönetici</option>
  <option value="2">Editör</option>
  <option value="3">Misafir</option>
</select>
```

Sonuç:

```json
{ "roles": [1, 2] }
```

### Aynı name’e sahip çoklu alan

```html
<input type="text" name="phone[]">
<input type="text" name="phone[]">
```

Sonuç:

```json
{ "phone[]": ["123", "456"] }
```

## AJAX yardımcıları

### `data-ajax-setup`

Bir butona veya form triggerına bu attribute eklenince, `$.ajaxSetup` ile otomatik olarak işlenir:

```html
<button type="submit" data-ajax-setup>Kaydet</button>
```

Bu buton bulunduğunda:

- `disabled` atanır
- içerik kaydedilir
- spinner yerleştirilir
- AJAX tamamlandığında eski metin geri gelir

### `beforeSend` ve `complete`

Helper dosyası otomatik olarak şunları yapar:

```javascript
$.fn.ajaxHelpers.beforeSend.setButtonContent();
$.fn.ajaxHelpers.complete.setButtonContent();
$.fn.ajaxHelpers.complete.closeBootstrapComponents();
```

Bu işlevler, AJAX isteklerinde UI gereksinimlerini standartlaştırır.

## Global Ajax ayarları

`$.ajaxSetup` içinde tanımlı davranışlar şu şekildedir:

```javascript
$.ajaxSetup({
  headers: {
    "X-CSRF-TOKEN": $("meta[name='X-CSRF-TOKEN']").attr("content")
  },
  beforeSend: function () {
    $.fn.ajaxHelpers.beforeSend.setButtonContent();
  },
  success: function (response) {
    const { result, message, entity } = response;
    if (message) {
      if (result) {
        toastr.success(message, "Başarılı");
      } else {
        toastr.error(message, "Hata");
      }
    }
  },
  complete: function () {
    $.fn.ajaxHelpers.complete.setButtonContent();
    $.fn.ajaxHelpers.complete.closeBootstrapComponents();
  },
  error: function (xhr, status, error, thrownError) {
    // hata mesajı parse edilir
  }
});
```

### Sunucu cevabı beklenen yapısı

Başarılı ya da hatalı cevaplarda aşağıdaki format kullanılabilir:

```json
{
  "result": true,
  "message": "İşlem başarılı şekilde tamamlandı."
}
```

veya

```json
{
  "result": false,
  "message": "İşlem sırasında hata meydana geldi."
}
```

### Hata URL ve detay ayrımı

Kod, `xhr.responseJSON.message` ve `xhr.responseJSON.detail` varsa bunları kullanır. `detail` varsa bunu başlık, `message` ise açıklama olarak gösterir.

## GlobalConfig yardımcıları

`window.GlobalConfig` üzerinden stil ve davranış standartları tanımlanır.

### `GlobalConfig.Select2(conf)`

```javascript
const selectConfig = GlobalConfig.Select2({
  placeholder: 'Seçim yapın',
  multiple: true
});

$('.my-select').select2(selectConfig);
```

Ön tanımlı değerler:

- `width: "100%"`
- `allowClear: true`
- `theme: "bootstrap-5"`
- `selectionCssClass: "select2--small"`
- `closeOnSelect: false`

### `GlobalConfig.DataTable(conf)`

```javascript
$('#usersTable').DataTable(GlobalConfig.DataTable({
  ajax: '/api/users',
  columns: [
    { data: 'id' },
    { data: 'name' },
    { data: 'email' }
  ]
}));
```

Ön tanımlı ayarlar:

- `dom: 'Blfrtip'`
- `responsive: true`
- `serverSide: true`
- `paging: true`
- `searching: true`
- `ordering: false`
- `lengthMenu: [25, 50, 75, 100]`
- `pageLength: 25`
- Türkçe metinler içeren `language` objesi

### `GlobalConfig.Quill(conf)`

```javascript
const quill = new Quill('#editor', GlobalConfig.Quill({
  placeholder: 'Metin yazın...'
}));
```

Bu yapılandırma, Quill için snow tema ve zengin toolbar listesi içerir.

### `GlobalConfig.Bootstrap()`

Bu fonksiyon şunları init eder:

- `data-bs-toggle="tooltip"` için tooltip oluşturur
- modal/offcanvas focus trap davranışını boş işlevlerle geçersiz kılar

## Uyarı ve toast ayarları

Toastr global olarak aşağıdaki ayarlarla başlatılır:

```javascript
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "showDuration": "300",
  "hideDuration": "300",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};
```

### Kullanım örnekleri

```javascript
toastr.success('Kayıt başarılı.', 'Başarılı');
toastr.error('Bir hata oluştu.', 'Hata');
toastr.info('Bilgi mesajı');
toastr.warning('Uyarı mesajı');
```

## Örnekler

### Örnek 1: Form submit ve AJAX gönderimi

```html
<form id="customerForm">
  <input type="text" name="full_name" placeholder="Ad Soyad">
  <input type="email" name="email" placeholder="E-posta">
  <button type="submit" data-ajax-setup>Gönder</button>
</form>

<script>
  $('#customerForm').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
      url: '/api/customers',
      type: 'POST',
      data: $(this).serializeObject(),
      success: function (response) {
        console.log('Başarılı', response);
      }
    });
  });
</script>
```

### Örnek 2: Select2 + DataTable

```javascript
$('.select2-search').select2(GlobalConfig.Select2({
  placeholder: 'Kullanıcı seçin'
}));

$('#usersTable').DataTable(GlobalConfig.DataTable({
  ajax: '/api/users',
  columns: [
    { data: 'id' },
    { data: 'name' },
    { data: 'email' }
  ]
}));
```

### Örnek 3: Quill editörü

```html
<div id="editor"></div>

<script>
  const editor = new Quill('#editor', GlobalConfig.Quill({
    placeholder: 'İçeriğinizi yazın...'
  }));
</script>
```

## Notlar ve dikkat edilmesi gerekenler

- Dosya, jQuery ve Bootstrap gibi kütüphanelerin yüklenmesini bekler.
- CSRF token kullanıyorsanız `meta[name='X-CSRF-TOKEN']` alanı zorunludur.
- `serializeObject` içinde `select2-hidden-accessible` sınıfı ve `select2('val')` kullanımı mevcuttur; bu yüzden Select2’nin yüklü olması gerekir.
- `DataTable` konfigürasyonu `serverSide: true` olarak tanımlanmıştır; bunun anlamı, verilerinizin sunucudan gelmesi gerektiğidir.
- `window.GlobalConfig.Bootstrap()` sayfa yüklendikten hemen sonra otomatik çalışır.
- `helper.js` tarafında `console.log(xhr, status, error, thrownError)` yazdırması vardır; geliştirme sırasında hata izlemeyi kolaylaştırır.

## Sonuç

`helper.js`, web uygulamalarında sık tekrarlanan işlemleri tek bir yerde toplamayı hedefler. Özellikle şu senaryolarda faydalıdır:

- admin panelleri
- CRUD ekranları
- kurumsal web arayüzleri
- hızlı prototip geliştirme
- jQuery tabanlı UI uygulamaları

Bu dosya, projeye eklenince bir nevi temel çalışma aracı gibi davranır; her projede benzer mantık tekrar tekrar yazılmak yerine tek bir standart sunar.

## Lisans ve kullanım

Bu dosya, projenize göre uyarlanabilir bir yardımcı kod parçasıdır. Kendi projelerinizde özgürce kullanabilir, gerektiğinde özelleştirebilir ve geliştirebilirsiniz.