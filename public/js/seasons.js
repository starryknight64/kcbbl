$(document).ready(function () {
    $("a.season").click(function () {
        var id = $(this).attr("id")
        $("div.season-body").load("/seasons/" + id)
    })
})
