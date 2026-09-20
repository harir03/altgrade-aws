import os
import shutil
import re

src_root = r"c:\Users\harir\Downloads\ALL\projects\aws\scratch\chair-website\chair-website\src"
dest_root = r"c:\Users\harir\Downloads\ALL\projects\aws\frontend\src\features\pitch"

# Directories to copy
dirs_to_copy = ["components", "sections", "utils"]

for d in dirs_to_copy:
    src_dir = os.path.join(src_root, d)
    dest_dir = os.path.join(dest_root, d)
    if os.path.exists(dest_dir):
        shutil.rmtree(dest_dir)
    shutil.copytree(src_dir, dest_dir)
    print(f"Copied {d} to {dest_dir}")

# Create styles dir
styles_dir = os.path.join(dest_root, "styles")
os.makedirs(styles_dir, exist_ok=True)

# Copy recursive.css
src_rec = os.path.join(src_root, "recursive.css")
dest_rec = os.path.join(styles_dir, "recursive.css")
shutil.copyfile(src_rec, dest_rec)
print(f"Copied recursive.css to {dest_rec}")

# Rewrite imports in all .ts and .tsx files in dest_root
for root, _, files in os.walk(dest_root):
    for f in files:
        if f.endswith((".ts", ".tsx")):
            file_path = os.path.join(root, f)
            with open(file_path, "r", encoding="utf-8") as fp:
                content = fp.read()
            
            # Replace "@/components" -> "@/features/pitch/components"
            # Replace "@/sections" -> "@/features/pitch/sections"
            # Replace "@/utils" -> "@/features/pitch/utils"
            updated = re.sub(r'from ["\']@/components', 'from "@/features/pitch/components', content)
            updated = re.sub(r'from ["\']@/sections', 'from "@/features/pitch/sections', updated)
            updated = re.sub(r'from ["\']@/utils', 'from "@/features/pitch/utils', updated)
            
            if updated != content:
                with open(file_path, "w", encoding="utf-8") as fp:
                    fp.write(updated)
                print(f"Updated imports in {os.path.relpath(file_path, dest_root)}")

print("All copies and import rewrites finished successfully.")
