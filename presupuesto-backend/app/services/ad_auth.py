from app.core.config_core import settings
import re
from ldap3 import Server, Connection, NTLM, ALL

def extract_group_names(dn_list):
    return [re.search(r'CN=([^,]+)', str(dn)).group(1) for dn in dn_list if "CN=" in str(dn)]

def validate_credentials(username: str, password: str):
    domain = settings.AD_DOMAIN
    base_dn = settings.AD_BASE_DN
    server_url = settings.AD_SERVER
    user_dn = f"{domain}\\{username}"
    server = Server(server_url, get_info=ALL)

    try:
        conn = Connection(server, user=user_dn, password=password, authentication=NTLM, auto_bind=True)

        search_filter = f"(sAMAccountName={username})"
        attributes = [
            "sAMAccountName", "displayName", "givenName", "sn", "mail", "title",
            "telephoneNumber", "department", "company", "memberOf",
            "distinguishedName", "userPrincipalName"
        ]

        conn.search(base_dn, search_filter, attributes=attributes)
        entry = conn.entries[0] if conn.entries else None

        if entry:
            # Construir user_info sin campos vacíos
            user_info = {
                attr: str(entry[attr]) for attr in attributes if attr in entry and str(entry[attr]).strip() != ""
            }

            # Extraer grupos (y quitar memberOf si existiera)
            if "memberOf" in entry:
                user_info["groups"] = extract_group_names(entry["memberOf"].values)
            else:
                user_info["groups"] = []

            # Crear el token con campos relevantes
            token_payload = {
                "sub": user_info.get("sAMAccountName", ""),
                "displayName": user_info.get("displayName", ""),
                "groups": user_info["groups"]
            }

            conn.unbind()
            return {"user": user_info, "token_data": token_payload}

        return None

    except Exception as e:
        print("LDAP error:", e)
        return None
