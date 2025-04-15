import React from "react";

const Footer: React.FunctionComponent = () => {
    return <footer className="footer">
        <div>Web app copyright © 2023-25 Paul Sobolik</div>
        <div>
            <a target={"_blank"} href={"https://icons.getbootstrap.com/"}>Bootstrap</a> symbols license: <a
            target={"_blank"} href={"https://github.com/twbs/icons/blob/main/LICENSE"}>MIT</a></div>
        <div>
            <a target={"_blank"} href={"https://fontawesome.com/"}>Font Awesome</a> sprites license <a
            target={"_blank"} href={"https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt"}>(OFL-1.1 OR
            MIT OR CC-BY-4.0)</a></div>
    </footer>
}
export default Footer;