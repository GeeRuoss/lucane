"""Reproduce the Lucane transparent speaker poster with Blender 5.2+.

/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
  --python poster-speaker.py
"""
import math
from pathlib import Path
import bpy
from mathutils import Vector, Matrix

SOURCE = Path(__file__).resolve().parent / 'assets' / 'speaker.glb'
OUTPUT = Path(__file__).resolve().parent / 'assets' / 'speaker-poster.webp'

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(SOURCE))
meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
points = [obj.matrix_world @ Vector(corner) for obj in meshes for corner in obj.bound_box]
minimum = Vector(tuple(min(p[i] for p in points) for i in range(3)))
maximum = Vector(tuple(max(p[i] for p in points) for i in range(3)))
scale = .50 / (maximum.z - minimum.z)
center = (minimum + maximum) / 2
transform = Matrix.Translation(Vector((-center.x * scale, -center.y * scale, .55 - minimum.z * scale))) @ Matrix.Scale(scale, 4)
# Apply one world transform while preserving every GLB material and mesh.
worlds = [(obj, transform @ obj.matrix_world.copy()) for obj in meshes]
for obj, world in worlds:
    obj.parent = None
    obj.matrix_world = world


def material(name, color, metallic, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Metallic'].default_value = metallic
    shader.inputs['Roughness'].default_value = roughness
    return mat

metal = material('Tripod | satin black anodized metal', (.012, .018, .033), .72, .28)
rubber = material('Tripod | rubber feet', (.006, .009, .014), .0, .70)


def tube(name, a, b, radius, mat, vertices=32):
    a, b = Vector(a), Vector(b)
    direction = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=direction.length, location=(a + b) / 2)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler = direction.to_track_quat('Z', 'Y').to_euler()
    obj.data.materials.append(mat)
    for face in obj.data.polygons:
        face.use_smooth = len(face.vertices) == 4
    bevel = obj.modifiers.new('Soft machined edge', 'BEVEL')
    bevel.width = .0009
    bevel.segments = 2
    obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    return obj


tube('Tripod | central mast', (0, 0, .20), (0, 0, .575), .010, metal)
tube('Tripod | upper collar', (0, 0, .255), (0, 0, .285), .026, metal)
for i in range(3):
    angle = i * math.tau / 3
    x, y = math.cos(angle), math.sin(angle)
    tube(f'Tripod | leg {i + 1}', (0, 0, .27), (.27 * x, .27 * y, .018), .009, metal)
    tube(f'Tripod | brace {i + 1}', (0, 0, .17), (.145 * x, .145 * y, .14), .005, metal)
    tube(f'Tripod | foot {i + 1}', (.252 * x, .252 * y, .029), (.274 * x, .274 * y, .012), .012, rubber)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 96
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.cycles.transparent_max_bounces = 8
scene.render.resolution_x = 1000
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'WEBP'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.image_settings.quality = 96
scene.render.filepath = str(OUTPUT)
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = .25

world = bpy.data.worlds.new('Dark blue studio')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (.025, .045, .12, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = .30
scene.world = world


def area(name, location, color, power, size, target=(0, 0, .70), shape='DISK'):
    light = bpy.data.lights.new(name, 'AREA')
    light.energy = power
    light.color = color
    light.shape = shape
    light.size = size
    obj = bpy.data.objects.new(name, light)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()
    return obj

area('Key | cool silver', (-1.8, -2.6, 3.0), (.82, .90, 1), 430, 2.1)
area('Side | electric cobalt', (1.6, .05, 1.35), (.045, .18, 1), 260, 1.15)
area('Rim | blue edge', (-.8, 1.6, 1.80), (.10, .32, 1), 350, 1.25)
area('Front | grille detail', (.35, -2.2, .9), (.75, .84, 1), 55, 1.4)

camera_data = bpy.data.cameras.new('Poster camera')
camera = bpy.data.objects.new('Poster camera', camera_data)
scene.collection.objects.link(camera)
camera.location = (1.5, -2.4, 1.05)
camera.rotation_euler = (Vector((0, 0, .58)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera_data.type = 'ORTHO'
camera_data.ortho_scale = 1.58
camera_data.lens = 62
scene.camera = camera

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.render.render(write_still=True)
print(f'POSTER_COMPLETE {OUTPUT}')
