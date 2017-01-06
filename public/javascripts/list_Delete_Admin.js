$(function () {
    // 拿到所有的删除按钮
    $('.del').click(function (e) {
        var target = $(e.target);//点击拿到当前按钮
        var id = target.data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE',
            url: '/admin/list?id=' + id
        })
            .done(function (results) {
                console.log(results);
                if (results.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            })
    })
    
});

