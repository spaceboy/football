class Splash {

    static splashScreenId = "splash-screen";

    static show () {
        document.getElementById(Splash.splashScreenId).style.display = "flex";
    }

    static hide () {
        document.getElementById(Splash.splashScreenId).style.display = "none";
    }

}

if (document.readyState === "complete") {
    Splash.hide();
} else {
    document.addEventListener("DOMContentLoaded", Splash.hide);
}
