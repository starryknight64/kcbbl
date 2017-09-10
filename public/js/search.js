$(document).ready(function () {
    var params = URI(location.search).query(true)
    var hasParams = false
    for (var param in params) {
        if (param.length > 1) {
            hasParams = true
            $("label#" + param).click()
        }
    }
    if (hasParams) {
        $("div#filterPanel").addClass("in")
    }

    $("button#reset").click((e) => {
        $("label.active").removeClass("active")
    })

    $("form#search").attr("method", "POST")
    $("input#search").on("keypress", (e) => {
        if (e.which === 13) {
            $("input#q").val($("input#search").val())
            $("form#filter").submit()
            return false
        }
    })
})
