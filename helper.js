$(function () {
    if (window.toastr) {
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
    }

    if ($) {
        $.fn.serializeObject = function () {
            var o = {};
            var a = this.serializeArray();

            // Tüm inputları işleme al
            this.find(':input').each(function () {
                var name = this.name;
                if (name != '') {
                    if (this.type === 'checkbox') {
                        // Checkbox için true/false değeri ekle
                        o[name] = this.checked;
                    } else if (this.type === 'radio') {
                        // Radio butonları için sadece seçili olanı al
                        if (this.checked) {
                            o[name] = this.value || '';
                        }
                    } else if (this.classList.contains('select2-hidden-accessible')) {
                        const $jQueryInstance = $(this);
                        const value = $jQueryInstance.select2('val');
                        if (typeof value != 'object') {
                            if (!isNaN(value) && value !== '')
                                o[name] = parseInt(value);
                            else
                                o[name] = value || '';
                        } else {
                            o[name] = value.map(function (v) {
                                return !isNaN(v) && v !== '' ? parseInt(v) : v;
                            });
                        }
                    } else {
                        // Diğer input türleri için serializeArray'deki değer kullanılır
                        var field = a.find(item => item.name === name);
                        if (field) {
                            // Checkbox zaten boolean değer atadıysa, hidden companion'ı atla
                            if (typeof o[name] === 'boolean') {
                                return;
                            }
                            if (!o[name]) {
                                o[name] = field.value || '';
                            } else {
                                if (!Array.isArray(o[name])) {
                                    o[name] = [o[name]];
                                }
                                o[name].push(field.value || '');
                            }
                        }
                    }

                }
            });

            // Eğer radio butonu hiç seçilmediyse, o name için değer tanımlanmamış olacak
            return o;
        };

        $.fn.ajaxHelpers = {
            beforeSend: {
                setButtonContent: function () {
                    Array.from(document.querySelectorAll("[data-ajax-setup]")).forEach(function (e, _) {
                        if (!e.hasAttribute('disabled'))
                            e.setAttribute('disabled', true);
                        if (e.innerHTML.trim() != '') {
                            e.setAttribute('data-text', e.innerHTML);
                            e.innerHTML = '<i class="far fa-spinner fa-spin"></i>';
                        }
                    });
                }
            },
            complete: {
                setButtonContent: function () {
                    Array.from(document.querySelectorAll("[data-ajax-setup]")).forEach(function (e, _) {
                        if (e.hasAttribute('disabled'))
                            e.removeAttribute('disabled');
                        if (e.hasAttribute('data-text') && e.getAttribute('data-text') != '') {
                            e.innerHTML = e.getAttribute("data-text");
                            e.removeAttribute("data-text");
                        }
                    });
                },
                closeBootstrapComponents: function () {
                    if (bootstrap) {
                        if (document.querySelector(".show.modal")) {
                            bootstrap.Modal.getInstance(document.querySelector(".show.modal")).hide();
                        }

                        if (document.querySelector(".show.offcanvas")) {
                            bootstrap.Offcanvas.getInstance(document.querySelector(".show.offcanvas")).hide();
                        }
                    }
                }
            }
        };

        if ($.fn.DataTable) {
            $.fn.DataTable.ext.errMode = 'none';
        }

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
            complete: function (xhr, status) {
                $.fn.ajaxHelpers.complete.setButtonContent();
                $.fn.ajaxHelpers.complete.closeBootstrapComponents();
            },
            error: function (xhr, status, error, thrownError) {
                let message = 'Hata';
                let detail = 'Beklenmeyen bir hata oluştu';

                console.log(xhr, status, error, thrownError)

                // responseJSON'ı kontrol et
                if (xhr.responseJSON) {
                    // Backend'den gelen mesajı al
                    if (xhr.responseJSON.message) {
                        message = xhr.responseJSON.message;
                    }

                    if (xhr.responseJSON.detail) {
                        detail = xhr.responseJSON.detail;
                    }
                } else if (xhr.statusText) {
                    message = xhr.statusText;
                    detail = xhr.statusText;
                } else if (error) {
                    message = error;
                    detail = error;
                }

                if (message.includes("<br/>")) {
                    message.split("<br/>").forEach(m => {
                        toastr.error("Hata", m);
                    });
                } else {
                    toastr.error(detail, message);
                }

                return this;
            },
        });
    }

    function GlobalConfig() {
        function Select2(conf) {
            return {
                width: "100%",
                allowClear: true,
                theme: "bootstrap-5",
                selectionCssClass: "select2--small",
                closeOnSelect: false,
                ...conf,
            };
        }

        function DataTable(conf) {
            return {
                dom: 'Blfrtip',
                responsive: true,
                // processing: true,
                serverSide: true,
                paging: true,
                searching: true,
                ordering: false,
                lengthMenu: [25, 50, 75, 100],
                pageLength: 25,
                drawCallback: function () {
                    // Bind the event handlers to the triggerers.
                    window.GlobalConfig.Bootstrap();
                },
                //initComplete: function () {},
                language: {
                    decimal: ",",
                    thousands: ".",
                    sProcessing: "İşleniyor...",
                    sLengthMenu: "Sayfada _MENU_ kayıt göster",
                    sZeroRecords: "Eşleşen kayıt bulunamadı",
                    sInfo: "_TOTAL_ kayıttan _START_ - _END_ arası gösteriliyor",
                    sInfoEmpty: "Kayıt yok",
                    sInfoFiltered: "(_MAX_ kayıt içerisinden filtrelendi)",
                    sSearch: "Ara:",
                    oPaginate: {
                        sFirst: "İlk",
                        sLast: "Son",
                        sNext: "Sonraki",
                        sPrevious: "Önceki"
                    }
                },
                ...conf,
            }
        }

        function Quill(conf) {
            return {
                theme: "snow",
                modules: {
                    toolbar: [
                        // Başlık seviyeleri
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],

                        // Font ve boyut
                        [{ font: [] }],
                        [{ size: ['small', false, 'large', 'huge'] }],

                        // Metin stilleri
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],

                        // Üst/Alt simge
                        [{ script: 'sub' }, { script: 'super' }],

                        // Alıntı ve kod
                        ['blockquote', 'code-block'],

                        // Listeler
                        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

                        // Girinti
                        [{ indent: '-1' }, { indent: '+1' }],

                        // Hizalama
                        [{ align: [] }],

                        // Medya ve bağlantılar
                        ['link', 'image', 'video', 'formula'],

                        // Temizleme
                        ['clean']
                    ]
                },
                ...conf,
            };
        }

        function Bootstrap() {
            if (bootstrap) {
                Array.from(document.querySelectorAll("[data-bs-toggle='tooltip']")).forEach((i) => {
                    new bootstrap.Tooltip(i);
                });

                $.fn.offcanvas.Constructor.prototype._initializeFocusTrap = () => ({
                    activate: () => { },
                    deactivate: () => { }
                });

                $.fn.modal.Constructor.prototype._initializeFocusTrap = () => ({
                    activate: () => { },
                    deactivate: () => { }
                });
            }
        }

        return {
            Select2,
            DataTable,
            Quill,
            Bootstrap
        };
    }

    window.GlobalConfig = GlobalConfig();
    window.GlobalConfig.Bootstrap();
});